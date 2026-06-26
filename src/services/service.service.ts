import { ServiceRepository } from '../repositories/service.repository';
import { AppError } from '../utils/AppError';

const serviceRepo = new ServiceRepository();

export class ServiceService {
  async getServices(tenantId: string) {
    return serviceRepo.findAllByTenant(tenantId);
  }

  async createService(tenantId: string, data: { name: string; price: number; unit: string }) {
    if (!data.name || data.price === undefined || !data.unit) {
      throw new AppError('Please provide name, price, and unit', 400);
    }

    return serviceRepo.create({
      tenantId,
      name: data.name,
      price: Number(data.price),
      unit: data.unit,
    });
  }

  async deleteService(tenantId: string, id: string) {
    const service = await serviceRepo.findById(id);

    if (!service || service.tenantId !== tenantId) {
      throw new AppError('Service not found', 404);
    }

    await serviceRepo.delete(id);
  }
}

export const serviceService = new ServiceService();
