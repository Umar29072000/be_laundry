import { OrderRepository } from '../repositories/order.repository';
import ExcelJS from 'exceljs';

const orderRepo = new OrderRepository();

export class ReportExportService {
  async generateExcelReport(tenantId: string, period?: string, storeName?: string) {
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
        startDate = new Date(0);
        break;
    }

    const [
      deliveredOrders,
      dailyRevenue,
      ordersByService,
      paymentBreakdown,
    ] = await Promise.all([
      orderRepo.getDeliveredOrdersInRange(tenantId, startDate, endDate),
      orderRepo.getDailyRevenue(tenantId, startDate, endDate),
      orderRepo.getOrdersByService(tenantId, startDate, endDate),
      orderRepo.getRevenueGroupByPaymentMethod(tenantId),
    ]);

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = deliveredOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Build workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = storeName || 'Laundry App';
    workbook.created = new Date();

    // ─── SHEET 1: Ringkasan ───
    const summarySheet = workbook.addWorksheet('Ringkasan');
    summarySheet.columns = [
      { header: 'Metrik', key: 'metric', width: 30 },
      { header: 'Nilai', key: 'value', width: 20 },
    ];

    summarySheet.addRow(['LAPORAN KEUANGAN LAUNDRY', '']);
    summarySheet.addRow([`Nama Toko: ${storeName || '-'}`, '']);
    summarySheet.addRow([`Periode: ${period || 'Semua Waktu'}`, '']);
    summarySheet.addRow([]);
    summarySheet.addRow(['Total Pendapatan', totalRevenue]);
    summarySheet.addRow(['Total Pesanan Selesai', totalOrders]);
    summarySheet.addRow(['Rata-rata per Pesanan', avgOrderValue]);
    summarySheet.addRow([]);
    summarySheet.addRow(['RINCIAN PER METODE PEMBAYARAN', '']);
    summarySheet.addRow(['Metode', 'Pendapatan', 'Jumlah Pesanan']);
    paymentBreakdown.forEach((p) => {
      summarySheet.addRow([p.paymentMethod, p._sum.totalPrice || 0, p._count.id]);
    });

    // Style header
    const headerRow = summarySheet.getRow(1);
    headerRow.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    summarySheet.getRow(2).font = { bold: true };
    summarySheet.getRow(3).font = { italic: true };
    summarySheet.getRow(5).font = { bold: true };
    summarySheet.getRow(9).font = { bold: true, color: { argb: 'FF2563EB' } };
    summarySheet.getRow(10).font = { bold: true };

    // ─── SHEET 2: Pendapatan Harian ───
    const dailySheet = workbook.addWorksheet('Pendapatan Harian');
    dailySheet.columns = [
      { header: 'Tanggal', key: 'date', width: 18 },
      { header: 'Pendapatan (Rp)', key: 'revenue', width: 20 },
    ];
    dailySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    dailySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

    dailyRevenue.forEach((d) => {
      dailySheet.addRow([d.date, d.revenue]);
    });

    // ─── SHEET 3: Per Layanan ───
    const serviceSheet = workbook.addWorksheet('Per Layanan');
    serviceSheet.columns = [
      { header: 'Layanan', key: 'name', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Pendapatan (Rp)', key: 'revenue', width: 20 },
    ];
    serviceSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    serviceSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

    ordersByService.forEach((s) => {
      serviceSheet.addRow([s.name, s.quantity, s.revenue]);
    });

    // ─── SHEET 4: Semua Pesanan ───
    const ordersSheet = workbook.addWorksheet('Detail Pesanan');
    ordersSheet.columns = [
      { header: 'ID Pesanan', key: 'id', width: 22 },
      { header: 'Pelanggan', key: 'customer', width: 25 },
      { header: 'Tanggal', key: 'date', width: 18 },
      { header: 'Total (Rp)', key: 'total', width: 18 },
      { header: 'Metode Bayar', key: 'payment', width: 18 },
      { header: 'Status', key: 'status', width: 15 },
    ];
    ordersSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ordersSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

    deliveredOrders.forEach((o) => {
      ordersSheet.addRow([
        o.id,
        o.customer?.name || '-',
        o.completedAt ? new Date(o.completedAt).toLocaleDateString('id-ID') : '-',
        o.totalPrice,
        o.paymentMethod,
        o.status,
      ]);
    });

    // Auto filter
    ordersSheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: deliveredOrders.length + 1, column: 6 } };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}

export const reportExportService = new ReportExportService();
