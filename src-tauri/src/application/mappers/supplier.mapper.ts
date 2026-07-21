import { Supplier } from '@domain/entities/supplier.entity';
import { SupplierDTO } from '../dtos/supplier.dto';

/**
 * Mapper for Supplier entity
 */
export class SupplierMapper {
  /**
   * Convert Supplier entity to SupplierDTO
   */
  static toDTO(supplier: Supplier): SupplierDTO {
    return {
      id: supplier.id,
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      taxId: supplier.taxId,
      active: supplier.active,
      createdAt: supplier.createdAt.toISOString(),
      updatedAt: supplier.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of Supplier entities to array of SupplierDTOs
   */
  static toDTOArray(suppliers: Supplier[]): SupplierDTO[] {
    return suppliers.map(supplier => this.toDTO(supplier));
  }
}
