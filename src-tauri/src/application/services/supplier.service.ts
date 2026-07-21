import { Supplier } from '@domain/entities/supplier.entity';
import { ISupplierRepository } from '@domain/repositories/supplier.repository.interface';
import { SupplierMapper } from '../mappers/supplier.mapper';
import {
  SupplierDTO,
  SupplierCreateDTO,
  SupplierUpdateDTO,
} from '../dtos/supplier.dto';
import { ValidationError, NotFoundError, ConflictError, BusinessError } from '@shared/errors/custom-error';
import { isRequired, isEmail, isPhone } from '@shared/validators/validators';

/**
 * Application service for Supplier operations
 */
export class SupplierService {
  constructor(private supplierRepository: ISupplierRepository) {}

  /**
   * Get all suppliers with optional filters
   */
  async getSuppliers(filters?: {
    active?: boolean;
  }): Promise<SupplierDTO[]> {
    const suppliers = await this.supplierRepository.findAll(filters);
    return SupplierMapper.toDTOArray(suppliers);
  }

  /**
   * Get supplier by ID
   */
  async getSupplierById(id: string): Promise<SupplierDTO> {
    const supplier = await this.supplierRepository.findById(id);
    
    if (!supplier) {
      throw new NotFoundError('Supplier', id);
    }

    return SupplierMapper.toDTO(supplier);
  }

  /**
   * Search suppliers by name, contact, email or phone
   */
  async searchSuppliers(query: string): Promise<SupplierDTO[]> {
    if (!isRequired(query)) {
      throw new ValidationError('Search query is required');
    }

    const suppliers = await this.supplierRepository.search(query);
    return SupplierMapper.toDTOArray(suppliers);
  }

  /**
   * Create a new supplier
   */
  async createSupplier(data: SupplierCreateDTO): Promise<SupplierDTO> {
    // Validate input
    this.validateSupplierCreate(data);

    // Check if name is available
    const nameAvailable = !(await this.supplierRepository.existsByName(data.name));
    if (!nameAvailable) {
      throw new ConflictError('Supplier name already exists');
    }

    // Check if taxId is available
    if (data.taxId) {
      const taxIdAvailable = !(await this.supplierRepository.existsByTaxId(data.taxId));
      if (!taxIdAvailable) {
        throw new ConflictError('Tax ID already exists');
      }
    }

    // Create supplier entity
    const supplier = Supplier.create({
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      taxId: data.taxId,
    });

    // Save supplier
    const createdSupplier = await this.supplierRepository.create(supplier);

    return SupplierMapper.toDTO(createdSupplier);
  }

  /**
   * Update an existing supplier
   */
  async updateSupplier(data: SupplierUpdateDTO): Promise<SupplierDTO> {
    // Get existing supplier
    const supplier = await this.supplierRepository.findById(data.id);
    if (!supplier) {
      throw new NotFoundError('Supplier', data.id);
    }

    // Validate input
    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Supplier name is required');
      }
      if (data.name.length < 2) {
        throw new ValidationError('Supplier name must be at least 2 characters');
      }
      
      // Check if name is available
      const nameAvailable = !(await this.supplierRepository.existsByName(data.name));
      if (!nameAvailable && data.name.toLowerCase() !== supplier.name.toLowerCase()) {
        throw new ConflictError('Supplier name already exists');
      }
      
      supplier.updateName(data.name);
    }

    if (data.contactName !== undefined) {
      supplier.updateContactName(data.contactName || null);
    }

    if (data.email !== undefined) {
      if (data.email && !isEmail(data.email)) {
        throw new ValidationError('Invalid email format');
      }
      supplier.updateEmail(data.email || null);
    }

    if (data.phone !== undefined) {
      if (data.phone && !isPhone(data.phone)) {
        throw new ValidationError('Invalid phone format');
      }
      supplier.updatePhone(data.phone || null);
    }

    if (data.address !== undefined) {
      supplier.updateAddress(data.address || null);
    }

    if (data.taxId !== undefined) {
      if (data.taxId) {
        const taxIdAvailable = !(await this.supplierRepository.existsByTaxId(data.taxId));
        if (!taxIdAvailable && data.taxId !== supplier.taxId) {
          throw new ConflictError('Tax ID already exists');
        }
      }
      supplier.updateTaxId(data.taxId || null);
    }

    if (data.active !== undefined) {
      if (data.active) {
        supplier.activate();
      } else {
        supplier.deactivate();
      }
    }

    // Save supplier
    const updatedSupplier = await this.supplierRepository.update(supplier);

    return SupplierMapper.toDTO(updatedSupplier);
  }

  /**
   * Delete a supplier
   */
  async deleteSupplier(id: string): Promise<void> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new NotFoundError('Supplier', id);
    }

    // Check if supplier has associated products or purchases
    // This would need to be implemented with product/purchase repositories
    // For now, we allow deletion with business logic check later

    await this.supplierRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validateSupplierCreate(data: SupplierCreateDTO): void {
    if (!isRequired(data.name)) {
      throw new ValidationError('Supplier name is required');
    }
    if (data.name.length < 2) {
      throw new ValidationError('Supplier name must be at least 2 characters');
    }
    if (data.email && !isEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }
    if (data.phone && !isPhone(data.phone)) {
      throw new ValidationError('Invalid phone format');
    }
  }
}
