import { Sale } from '../entities/sale.entity';

/**
 * Interface for Sale repository
 */
export interface ISaleRepository {
  findById(id: string): Promise<Sale | null>;
  findByFolio(folio: string): Promise<Sale | null>;
  findAll(filters?: {
    customerId?: string;
    paymentMethodId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Sale[]>;
  create(sale: Sale): Promise<Sale>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
  existsByFolio(folio: string): Promise<boolean>;
  count(filters?: {
    customerId?: string;
  }): Promise<number>;
}
