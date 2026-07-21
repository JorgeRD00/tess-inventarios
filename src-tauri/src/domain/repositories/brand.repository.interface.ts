import { Brand } from '../entities/brand.entity';

/**
 * Interface for Brand repository
 */
export interface IBrandRepository {
  findById(id: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  findAll(filters?: {
    active?: boolean;
  }): Promise<Brand[]>;
  create(brand: Brand): Promise<Brand>;
  update(brand: Brand): Promise<Brand>;
  delete(id: string): Promise<void>;
  
  existsByName(name: string): Promise<boolean>;
  count(filters?: {
    active?: boolean;
  }): Promise<number>;
}
