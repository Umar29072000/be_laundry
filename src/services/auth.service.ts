import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TenantRepository } from '../repositories/tenant.repository';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { supabase } from '../config/supabase';

const tenantRepo = new TenantRepository();

export class AuthService {
  private signToken(id: string) {
    return jwt.sign({ id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  async register(data: {
    storeName: string;
    ownerName: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
  }) {
    if (!data.password) {
      throw new AppError('Password is required', 400);
    }

    const existingTenant = await tenantRepo.findByEmail(data.email);
    if (existingTenant) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const tenant = await tenantRepo.create({
      storeName: data.storeName,
      ownerName: data.ownerName,
      email: data.email,
      passwordHash,
      phone: data.phone,
      address: data.address,
    });

    const token = this.signToken(tenant.id);

    return { token, tenant };
  }

  async login(email: string, password?: string) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const tenant = await tenantRepo.findByEmail(email);

    if (!tenant || !(await bcrypt.compare(password, tenant.passwordHash))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = this.signToken(tenant.id);

    return { token, tenant };
  }

  async updateProfile(id: string, data: { storeName?: string; ownerName?: string; phone?: string; address?: string }) {
    return tenantRepo.update(id, data);
  }

  async updatePassword(id: string, data: { oldPassword?: string; newPassword?: string }) {
    if (!data.oldPassword || !data.newPassword) {
      throw new AppError('Please provide old and new password', 400);
    }

    const tenant = await tenantRepo.findById(id);
    if (!tenant || !(await bcrypt.compare(data.oldPassword, tenant.passwordHash))) {
      throw new AppError('Incorrect old password', 401);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await tenantRepo.update(id, { passwordHash });
  }

  async updateProfilePicture(id: string, file?: Express.Multer.File) {
    if (!file) {
      throw new AppError('Please upload an image file', 400);
    }

    const ext = file.mimetype.split('/')[1];
    const filename = `tenant-${id}-${Date.now()}.${ext}`;
    const bucketName = env.SUPABASE_BUCKET_NAME;

    // Upload file buffer ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Overwrite jika file dengan nama sama sudah ada
      });

    if (uploadError) {
      throw new AppError(`Failed to upload image: ${uploadError.message}`, 500);
    }

    // Dapatkan public URL dari Supabase Storage
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filename);
    const profilePictureUrl = urlData.publicUrl;

    return tenantRepo.update(id, { profilePictureUrl });
  }
}

export const authService = new AuthService();

