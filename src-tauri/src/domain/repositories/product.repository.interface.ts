import { Product } from '../entities/product.entity';

/**
 * Interface for Product repository
 */
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByInternalCode(internalCode: string): Promise<Product | null>;
  findByBarcode(barcode: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  
  existsByInternalCode(internalCode: string): Promise<boolean>;
  existsByBarcode(barcode: string): Promise<boolean>;
  count(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
  }): Promise<number>;
}
