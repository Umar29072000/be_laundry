import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TenantResponseDTO } from '../responses/tenant.response';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { storeName, ownerName, email, password, phone, address } = req.body;
  const result = await authService.register({ storeName, ownerName, email, password, phone, address });

  res.status(201).json({
    status: 'success',
    token: result.token,
    data: {
      tenant: TenantResponseDTO.format(result.tenant),
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    token: result.token,
    data: {
      tenant: TenantResponseDTO.format(result.tenant),
    },
  });
});

export const getProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    data: {
      tenant: TenantResponseDTO.format(req.tenant),
    },
  });
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { storeName, ownerName, phone, address } = req.body;
  const updatedTenant = await authService.updateProfile(req.tenant.id, { storeName, ownerName, phone, address });

  res.status(200).json({
    status: 'success',
    data: {
      tenant: TenantResponseDTO.format(updatedTenant),
    },
  });
});

export const updatePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body;
  await authService.updatePassword(req.tenant.id, { oldPassword, newPassword });

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

export const updateProfilePicture = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const updatedTenant = await authService.updateProfilePicture(req.tenant.id, req.file);

  res.status(200).json({
    status: 'success',
    data: {
      tenant: TenantResponseDTO.format(updatedTenant),
    },
  });
});
