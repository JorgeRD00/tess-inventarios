import { Customer } from '@domain/entities/customer.entity';
import { CustomerDTO } from '../dtos/customer.dto';

/**
 * Mapper for Customer entity
 */
export class CustomerMapper {
  /**
   * Convert Customer entity to CustomerDTO
   */
  static toDTO(customer: Customer): CustomerDTO {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      taxId: customer.taxId,
      active: customer.active,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of Customer entities to array of CustomerDTOs
   */
  static toDTOArray(customers: Customer[]): CustomerDTO[] {
    return customers.map(customer => this.toDTO(customer));
  }
}
