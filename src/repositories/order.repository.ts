import { prisma } from '../models/db';
import { PaymentMethod, OrderStatus } from '@prisma/client';

export class OrderRepository {
  async findAllByTenant(tenantId: string) {
    return prisma.order.findMany({
      where: { tenantId },
      include: {
        customer: true,
        orderItems: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        tenant: { select: { storeName: true, phone: true } },
        customer: { select: { name: true, email: true, phone: true } },
        orderItems: { include: { service: { select: { name: true } } } },
      },
    });
  }

  async create(data: {
    id: string;
    tenantId: string;
    customerId: string;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    orderItems: {
      create: Array<{
        serviceId: string;
        quantity: number;
        subtotal: number;
      }>;
    };
  }) {
    return prisma.order.create({
      data,
      include: {
        customer: true,
        orderItems: true,
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus, completedAt?: Date) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        completedAt,
      },
    });
  }

  async countByTenant(tenantId: string) {
    return prisma.order.count({ where: { tenantId } });
  }

  async countPendingByTenant(tenantId: string) {
    return prisma.order.count({ where: { tenantId, status: 'Pending' } });
  }

  async getRevenueByTenant(tenantId: string) {
    return prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        tenantId,
        status: 'Delivered',
      },
    });
  }

  async getRevenueGroupByPaymentMethod(tenantId: string) {
    return prisma.order.groupBy({
      by: ['paymentMethod'],
      where: {
        tenantId,
        status: 'Delivered',
      },
      _sum: {
        totalPrice: true,
      },
      _count: {
        id: true,
      },
    });
  }
}
