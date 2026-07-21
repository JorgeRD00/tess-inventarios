import { Purchase } from '../entities/purchase.entity';

/**
 * Interface for Purchase repository
 */
export interface IPurchaseRepository {
  findById(id: string): Promise<Purchase | null>;
  findByFolio(folio: string): Promise<Purchase | null>;
  findAll(filters?: {
    supplierId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Purchase[]>;
  create(purchase: Purchase): Promise<Purchase>;
  update(purchase: Purchase): Promise<Purchase>;
  delete(id: string): Promise<void>;
  existsByFolio(folio: string): Promise<boolean>;
  count(filters?: {
    supplierId?: string;
  }): Promise<number>;
}
