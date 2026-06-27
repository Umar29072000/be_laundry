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

  async getRevenueByTenant(tenantId: string, dateRange?: { start: Date; end: Date }) {
    return prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        tenantId,
        status: 'Delivered',
        ...(dateRange ? {
          completedAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        } : {}),
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

  async getDeliveredOrdersInRange(tenantId: string, startDate: Date, endDate: Date) {
    return prisma.order.findMany({
      where: {
        tenantId,
        status: 'Delivered',
        completedAt: { gte: startDate, lte: endDate },
      },
      include: {
        orderItems: { include: { service: true } },
        customer: true,
      },
      orderBy: { completedAt: 'asc' },
    });
  }

  async getDailyRevenue(tenantId: string, startDate: Date, endDate: Date) {
    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        status: 'Delivered',
        completedAt: { gte: startDate, lte: endDate },
      },
      select: {
        totalPrice: true,
        completedAt: true,
      },
      orderBy: { completedAt: 'asc' },
    });

    const dailyMap: Record<string, number> = {};
    for (const order of orders) {
      if (order.completedAt) {
        const dayKey = order.completedAt.toISOString().slice(0, 10);
        dailyMap[dayKey] = (dailyMap[dayKey] || 0) + order.totalPrice;
      }
    }
    return Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }));
  }

  async getOrdersByService(tenantId: string, startDate: Date, endDate: Date) {
    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        status: 'Delivered',
        completedAt: { gte: startDate, lte: endDate },
      },
      select: {
        orderItems: {
          select: {
            quantity: true,
            subtotal: true,
            service: { select: { name: true } },
          },
        },
      },
    });

    const serviceMap: Record<string, { quantity: number; revenue: number }> = {};
    for (const order of orders) {
      for (const item of order.orderItems) {
        const name = item.service?.name || 'Lainnya';
        if (!serviceMap[name]) serviceMap[name] = { quantity: 0, revenue: 0 };
        serviceMap[name].quantity += item.quantity;
        serviceMap[name].revenue += item.subtotal;
      }
    }
    return Object.entries(serviceMap).map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue,
    }));
  }

  async getOrdersByStatus(tenantId: string) {
    const statuses: OrderStatus[] = ['Pending', 'Washing', 'Ironing', 'Ready', 'Delivered'];
    const result: { status: string; count: number }[] = [];
    for (const status of statuses) {
      const count = await prisma.order.count({ where: { tenantId, status } });
      result.push({ status, count });
    }
    return result;
  }
}
