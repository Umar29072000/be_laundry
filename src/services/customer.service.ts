import { CustomerRepository } from '../repositories/customer.repository';
import { AppError } from '../utils/AppError';

const customerRepo = new CustomerRepository();

export class CustomerService {
  async getCustomers(tenantId: string) {
    return customerRepo.findAllByTenant(tenantId);
  }

  async createCustomer(tenantId: string, data: { name: string; email?: string; phone: string; address: string }) {
    if (!data.name || !data.phone || !data.address) {
      throw new AppError('Please provide name, phone and address', 400);
    }

    return customerRepo.create({
      tenantId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
  }

  async deleteCustomer(tenantId: string, id: string) {
    const customer = await customerRepo.findById(id);

    if (!customer || customer.tenantId !== tenantId) {
      throw new AppError('Customer not found', 404);
    }

    await customerRepo.delete(id);
  }
}

export const customerService = new CustomerService();
