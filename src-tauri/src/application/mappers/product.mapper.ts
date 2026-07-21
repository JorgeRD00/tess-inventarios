import { Product } from '@domain/entities/product.entity';
import { ProductImage } from '@domain/entities/product-image.entity';
import { MotorcycleCompatibility } from '@domain/entities/motorcycle-compatibility.entity';
import {
  ProductDTO,
  ProductImageDTO,
  MotorcycleCompatibilityDTO,
} from '../dtos/product.dto';
import { BrandMapper, CategoryMapper } from './category.mapper';

/**
 * Mapper for ProductImage entity
 */
export class ProductImageMapper {
  static toDTO(image: ProductImage): ProductImageDTO {
    return {
      id: image.id,
      productId: image.productId,
      path: image.path,
      order: image.order,
      createdAt: image.createdAt.toISOString(),
    };
  }

  static toDTOArray(images: ProductImage[]): ProductImageDTO[] {
    return images.map(img => this.toDTO(img));
  }
}

/**
 * Mapper for MotorcycleCompatibility entity
 */
export class MotorcycleCompatibilityMapper {
  static toDTO(compatibility: MotorcycleCompatibility): MotorcycleCompatibilityDTO {
    return {
      id: compatibility.id,
      productId: compatibility.productId,
      brand: compatibility.brand,
      model: compatibility.model,
      year: compatibility.year,
      notes: compatibility.notes,
    };
  }

  static toDTOArray(compatibilities: MotorcycleCompatibility[]): MotorcycleCompatibilityDTO[] {
    return compatibilities.map(c => this.toDTO(c));
  }
}

/**
 * Mapper for Product entity
 */
export class ProductMapper {
  /**
   * Convert Product entity to ProductDTO
   */
  static toDTO(product: Product): ProductDTO {
    return {
      id: product.id,
      internalCode: product.internalCode,
      barcode: product.barcode,
      sku: product.sku,
      name: product.name,
      description: product.description,
      brandId: product.brandId,
      brand: product.brand ? BrandMapper.toDTO(product.brand) : undefined,
      categoryId: product.categoryId,
      category: product.category ? CategoryMapper.toDTO(product.category) : undefined,
      unit: product.unit,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      location: product.location,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      supplierId: product.supplierId,
      observations: product.observations,
      active: product.active,
      images: ProductImageMapper.toDTOArray(product.images),
      compatibilities: MotorcycleCompatibilityMapper.toDTOArray(product.compatibilities),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of Product entities to array of ProductDTOs
   */
  static toDTOArray(products: Product[]): ProductDTO[] {
    return products.map(product => this.toDTO(product));
  }
}
