import { Customer } from '@domain/entities/customer.entity';
import { ICustomerRepository } from '@domain/repositories/customer.repository.interface';
import { CustomerMapper } from '../mappers/customer.mapper';
import {
  CustomerDTO,
  CustomerCreateDTO,
  CustomerUpdateDTO,
} from '../dtos/customer.dto';
import { ValidationError, NotFoundError, ConflictError } from '@shared/errors/custom-error';
import { isRequired, isEmail, isPhone } from '@shared/validators/validators';

/**
 * Application service for Customer operations
 */
export class CustomerService {
  constructor(private customerRepository: ICustomerRepository) {}

  /**
   * Get all customers with optional filters
   */
  async getCustomers(filters?: {
    active?: boolean;
  }): Promise<CustomerDTO[]> {
    const customers = await this.customerRepository.findAll(filters);
    return CustomerMapper.toDTOArray(customers);
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<CustomerDTO> {
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    return CustomerMapper.toDTO(customer);
  }

  /**
   * Search customers by name, email or phone
   */
  async searchCustomers(query: string): Promise<CustomerDTO[]> {
    if (!isRequired(query)) {
      throw new ValidationError('Search query is required');
    }

    const customers = await this.customerRepository.search(query);
    return CustomerMapper.toDTOArray(customers);
  }

  /**
   * Create a new customer
   */
  async createCustomer(data: CustomerCreateDTO): Promise<CustomerDTO> {
    // Validate input
    this.validateCustomerCreate(data);

    // Check if name is available
    const nameAvailable = !(await this.customerRepository.existsByName(data.name));
    if (!nameAvailable) {
      throw new ConflictError('Customer name already exists');
    }

    // Check if taxId is available
    if (data.taxId) {
      const taxIdAvailable = !(await this.customerRepository.existsByTaxId(data.taxId));
      if (!taxIdAvailable) {
        throw new ConflictError('Tax ID already exists');
      }
    }

    // Create customer entity
    const customer = Customer.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      taxId: data.taxId,
    });

    // Save customer
    const createdCustomer = await this.customerRepository.create(customer);

    return CustomerMapper.toDTO(createdCustomer);
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(data: CustomerUpdateDTO): Promise<CustomerDTO> {
    // Get existing customer
    const customer = await this.customerRepository.findById(data.id);
    if (!customer) {
      throw new NotFoundError('Customer', data.id);
    }

    // Validate input
    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Customer name is required');
      }
      if (data.name.length < 2) {
        throw new ValidationError('Customer name must be at least 2 characters');
      }
      
      // Check if name is available
      const nameAvailable = !(await this.customerRepository.existsByName(data.name));
      if (!nameAvailable && data.name.toLowerCase() !== customer.name.toLowerCase()) {
        throw new ConflictError('Customer name already exists');
      }
      
      customer.updateName(data.name);
    }

    if (data.email !== undefined) {
      if (data.email && !isEmail(data.email)) {
        throw new ValidationError('Invalid email format');
      }
      customer.updateEmail(data.email || null);
    }

    if (data.phone !== undefined) {
      if (data.phone && !isPhone(data.phone)) {
        throw new ValidationError('Invalid phone format');
      }
      customer.updatePhone(data.phone || null);
    }

    if (data.address !== undefined) {
      customer.updateAddress(data.address || null);
    }

    if (data.taxId !== undefined) {
      if (data.taxId) {
        const taxIdAvailable = !(await this.customerRepository.existsByTaxId(data.taxId));
        if (!taxIdAvailable && data.taxId !== customer.taxId) {
          throw new ConflictError('Tax ID already exists');
        }
      }
      customer.updateTaxId(data.taxId || null);
    }

    if (data.active !== undefined) {
      if (data.active) {
        customer.activate();
      } else {
        customer.deactivate();
      }
    }

    // Save customer
    const updatedCustomer = await this.customerRepository.update(customer);

    return CustomerMapper.toDTO(updatedCustomer);
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    await this.customerRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validateCustomerCreate(data: CustomerCreateDTO): void {
    if (!isRequired(data.name)) {
      throw new ValidationError('Customer name is required');
    }
    if (data.name.length < 2) {
      throw new ValidationError('Customer name must be at least 2 characters');
    }
    if (data.email && !isEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }
    if (data.phone && !isPhone(data.phone)) {
      throw new ValidationError('Invalid phone format');
    }
  }
}
