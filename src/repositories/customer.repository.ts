import { prisma } from '../models/db';

export class CustomerRepository {
  async findAllByTenant(tenantId: string) {
    return prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.customer.findUnique({ where: { id } });
  }

  async create(data: {
    tenantId: string;
    name: string;
    email?: string;
    phone: string;
    address: string;
  }) {
    return prisma.customer.create({ data });
  }

  async delete(id: string) {
    return prisma.customer.delete({ where: { id } });
  }

  async countByTenant(tenantId: string) {
    return prisma.customer.count({ where: { tenantId } });
  }
}
