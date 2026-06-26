export class CustomerResponseDTO {
  static format(customer: any) {
    if (!customer) return null;
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.createdAt,
    };
  }

  static formatMany(customers: any[]) {
    return customers.map((customer) => this.format(customer));
  }
}
