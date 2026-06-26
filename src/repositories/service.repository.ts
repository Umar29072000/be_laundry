import { prisma } from '../models/db';

export class ServiceRepository {
  async findAllByTenant(tenantId: string) {
    return prisma.service.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  }

  async create(data: {
    tenantId: string;
    name: string;
    price: number;
    unit: string;
  }) {
    return prisma.service.create({ data });
  }

  async delete(id: string) {
    return prisma.service.delete({ where: { id } });
  }
}
