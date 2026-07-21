import { Customer } from '../entities/customer.entity';

/**
 * Interface for Customer repository
 */
export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByName(name: string): Promise<Customer | null>;
  findByTaxId(taxId: string): Promise<Customer | null>;
  findAll(filters?: {
    active?: boolean;
  }): Promise<Customer[]>;
  search(query: string): Promise<Customer[]>;
  create(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  
  existsByName(name: string): Promise<boolean>;
  existsByTaxId(taxId: string): Promise<boolean>;
  count(filters?: {
    active?: boolean;
  }): Promise<number>;
}
