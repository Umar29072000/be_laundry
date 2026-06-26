import { CustomerRepository } from '../repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';

const customerRepo = new CustomerRepository();
const orderRepo = new OrderRepository();

export class DashboardService {
  async getDashboardStats(tenantId: string) {
    const totalCustomers = await customerRepo.countByTenant(tenantId);
    const totalOrders = await orderRepo.countByTenant(tenantId);
    const pendingOrdersCount = await orderRepo.countPendingByTenant(tenantId);

    const revenueResult = await orderRepo.getRevenueByTenant(tenantId);
    const totalRevenue = revenueResult._sum.totalPrice || 0;

    return {
      totalCustomers,
      totalOrders,
      pendingOrdersCount,
      totalRevenue,
    };
  }
}

export const dashboardService = new DashboardService();
