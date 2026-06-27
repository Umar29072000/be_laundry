import { CustomerResponseDTO } from './customer.response';

export class OrderResponseDTO {
  static format(order: any) {
    if (!order) return null;
    return {
      id: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      completedAt: order.completedAt,
      customer: order.customer ? CustomerResponseDTO.format(order.customer) : undefined,
      tenant: order.tenant ? {
        storeName: order.tenant.storeName,
        phone: order.tenant.phone,
      } : undefined,
      orderItems: order.orderItems ? order.orderItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        subtotal: item.subtotal,
        service: item.service ? {
          id: item.service.id,
          name: item.service.name,
          price: item.service.price,
          unit: item.service.unit,
        } : undefined,
      })) : undefined,
    };
  }

  static formatMany(orders: any[]) {
    return orders.map((order) => this.format(order));
  }
}
