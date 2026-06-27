import { CustomerRepository } from '../repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';

const customerRepo = new CustomerRepository();
const orderRepo = new OrderRepository();

export class DashboardService {
  async getDashboardStats(tenantId: string) {
    const [
      totalCustomers,
      totalOrders,
      pendingOrdersCount,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      customerRepo.countByTenant(tenantId),
      orderRepo.countByTenant(tenantId),
      orderRepo.countPendingByTenant(tenantId),
      orderRepo.getRevenueByTenant(tenantId, this.getDateRange('today')),
      orderRepo.getRevenueByTenant(tenantId, this.getDateRange('week')),
      orderRepo.getRevenueByTenant(tenantId, this.getDateRange('month')),
      orderRepo.getOrdersByStatus(tenantId),
      this.getRecentOrders(tenantId),
    ]);

    const totalRevenueResult = await orderRepo.getRevenueByTenant(tenantId);

    return {
      totalCustomers,
      totalOrders,
      pendingOrdersCount,
      totalRevenue: totalRevenueResult._sum.totalPrice || 0,
      todayRevenue: todayRevenue._sum.totalPrice || 0,
      weeklyRevenue: weeklyRevenue._sum.totalPrice || 0,
      monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
      ordersByStatus,
      recentOrders,
    };
  }

  private getDateRange(range: 'today' | 'week' | 'month'): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
    }

    return { start, end: now };
  }

  private async getRecentOrders(tenantId: string) {
    const orders = await orderRepo.findAllByTenant(tenantId);
    return orders.slice(0, 5).map((o) => ({
      id: o.id,
      customerName: o.customer?.name || '-',
      totalPrice: o.totalPrice,
      status: o.status,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
    }));
  }
}

export const dashboardService = new DashboardService();
