import { OrderRepository } from '../repositories/order.repository';

const orderRepo = new OrderRepository();

export class ReportService {
  async getReports(tenantId: string, period?: string) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // All time
        startDate = new Date(0);
        break;
    }

    const [
      revenueByPaymentMethod,
      dailyRevenue,
      ordersByService,
      ordersByStatus,
      deliveredOrders,
    ] = await Promise.all([
      orderRepo.getRevenueGroupByPaymentMethod(tenantId),
      orderRepo.getDailyRevenue(tenantId, startDate, endDate),
      orderRepo.getOrdersByService(tenantId, startDate, endDate),
      orderRepo.getOrdersByStatus(tenantId),
      orderRepo.getDeliveredOrdersInRange(tenantId, startDate, endDate),
    ]);

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = deliveredOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const paymentBreakdown = revenueByPaymentMethod.map((item) => ({
      paymentMethod: item.paymentMethod,
      totalRevenue: item._sum.totalPrice || 0,
      orderCount: item._count.id,
    }));

    return {
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
      },
      dailyRevenue,
      ordersByService,
      ordersByStatus,
      paymentBreakdown,
    };
  }
}

export const reportService = new ReportService();
