import { Category } from '@domain/entities/category.entity';
import { Brand } from '@domain/entities/brand.entity';
import {
  CategoryDTO,
  BrandDTO,
} from '../dtos/category.dto';

/**
 * Mapper for Category entity
 */
export class CategoryMapper {
  /**
   * Convert Category entity to CategoryDTO
   */
  static toDTO(category: Category): CategoryDTO {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      active: category.active,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of Category entities to array of CategoryDTOs
   */
  static toDTOArray(categories: Category[]): CategoryDTO[] {
    return categories.map(category => this.toDTO(category));
  }
}

/**
 * Mapper for Brand entity
 */
export class BrandMapper {
  /**
   * Convert Brand entity to BrandDTO
   */
  static toDTO(brand: Brand): BrandDTO {
    return {
      id: brand.id,
      name: brand.name,
      description: brand.description,
      website: brand.website,
      active: brand.active,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of Brand entities to array of BrandDTOs
   */
  static toDTOArray(brands: Brand[]): BrandDTO[] {
    return brands.map(brand => this.toDTO(brand));
  }
}
