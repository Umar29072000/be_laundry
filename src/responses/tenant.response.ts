export class TenantResponseDTO {
  static format(tenant: any) {
    if (!tenant) return null;
    return {
      id: tenant.id,
      storeName: tenant.storeName,
      ownerName: tenant.ownerName,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      profilePictureUrl: tenant.profilePictureUrl,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

  static formatMany(tenants: any[]) {
    return tenants.map((tenant) => this.format(tenant));
  }
}
