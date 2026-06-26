import { OrderRepository } from '../repositories/order.repository';

const orderRepo = new OrderRepository();

export class ReportService {
  async getReports(tenantId: string) {
    const revenueByPaymentMethod = await orderRepo.getRevenueGroupByPaymentMethod(tenantId);

    const reportData = revenueByPaymentMethod.map((item) => ({
      paymentMethod: item.paymentMethod,
      totalRevenue: item._sum.totalPrice || 0,
      orderCount: item._count.id,
    }));

    return reportData;
  }
}

export const reportService = new ReportService();
