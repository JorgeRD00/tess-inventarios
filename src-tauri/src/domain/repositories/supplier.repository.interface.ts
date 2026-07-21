import { Supplier } from '../entities/supplier.entity';

/**
 * Interface for Supplier repository
 */
export interface ISupplierRepository {
  findById(id: string): Promise<Supplier | null>;
  findByName(name: string): Promise<Supplier | null>;
  findByTaxId(taxId: string): Promise<Supplier | null>;
  findAll(filters?: {
    active?: boolean;
  }): Promise<Supplier[]>;
  search(query: string): Promise<Supplier[]>;
  create(supplier: Supplier): Promise<Supplier>;
  update(supplier: Supplier): Promise<Supplier>;
  delete(id: string): Promise<void>;
  
  existsByName(name: string): Promise<boolean>;
  existsByTaxId(taxId: string): Promise<boolean>;
  count(filters?: {
    active?: boolean;
  }): Promise<number>;
}
