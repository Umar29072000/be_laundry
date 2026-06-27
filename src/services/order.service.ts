import { OrderRepository } from '../repositories/order.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { ServiceRepository } from '../repositories/service.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { AppError } from '../utils/AppError';
import { generateOrderId } from '../utils/generateId';
import { sendReceiptEmail } from '../config/mailer';
import { PaymentMethod, OrderStatus } from '@prisma/client';

const orderRepo = new OrderRepository();
const customerRepo = new CustomerRepository();
const serviceRepo = new ServiceRepository();
const tenantRepo = new TenantRepository();

export class OrderService {
  async getOrders(tenantId: string) {
    return orderRepo.findAllByTenant(tenantId);
  }

  async createOrder(tenantId: string, data: { customerId: string; items: Array<{ serviceId: string; quantity: number }>; paymentMethod: string }) {
    const { customerId, items, paymentMethod } = data;

    if (!customerId || !items || items.length === 0 || !paymentMethod) {
      throw new AppError('Please provide customerId, items, and paymentMethod', 400);
    }

    const customer = await customerRepo.findById(customerId);
    if (!customer || customer.tenantId !== tenantId) {
      throw new AppError('Customer not found', 404);
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const service = await serviceRepo.findById(item.serviceId);
      if (!service || service.tenantId !== tenantId) {
        throw new AppError(`Service with ID ${item.serviceId} not found`, 404);
      }

      const subtotal = service.price * item.quantity;
      totalPrice += subtotal;

      orderItemsData.push({
        serviceId: service.id,
        quantity: item.quantity,
        subtotal,
      });
    }

    const orderId = generateOrderId();

    const newOrder = await orderRepo.create({
      id: orderId,
      tenantId,
      customerId,
      totalPrice,
      paymentMethod: paymentMethod as PaymentMethod,
      orderItems: {
        create: orderItemsData,
      },
    });

    if (customer.email) {
      const tenant = await tenantRepo.findById(tenantId);
      const storeName = tenant?.storeName || 'Laundry Online';
      sendReceiptEmail(customer.email, orderId, totalPrice, customer.name, storeName);
    }

    return newOrder;
  }

  async updateOrderStatus(tenantId: string, orderId: string, status: string) {
    if (!status) {
      throw new AppError('Please provide a status', 400);
    }

    const order = await orderRepo.findById(orderId);
    if (!order || order.tenantId !== tenantId) {
      throw new AppError('Order not found', 404);
    }

    const completedAt = status === 'Delivered' ? new Date() : undefined;
    return orderRepo.updateStatus(orderId, status as OrderStatus, completedAt);
  }

  async trackOrder(orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }
}

export const orderService = new OrderService();
