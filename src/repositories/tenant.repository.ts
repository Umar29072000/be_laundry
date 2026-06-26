import { prisma } from '../models/db';

export class TenantRepository {
  async findByEmail(email: string) {
    return prisma.tenant.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.tenant.findUnique({ where: { id } });
  }

  async create(data: {
    storeName: string;
    ownerName: string;
    email: string;
    passwordHash: string;
    phone: string;
    address: string;
  }) {
    return prisma.tenant.create({ data });
  }

  async update(id: string, data: {
    storeName?: string;
    ownerName?: string;
    phone?: string;
    address?: string;
    passwordHash?: string;
    profilePictureUrl?: string;
  }) {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  }
}
