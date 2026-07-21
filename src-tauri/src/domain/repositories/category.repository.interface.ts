import { Category } from '../entities/category.entity';

/**
 * Interface for Category repository
 */
export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(filters?: {
    active?: boolean;
  }): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  
  existsByName(name: string): Promise<boolean>;
  count(filters?: {
    active?: boolean;
  }): Promise<number>;
}
