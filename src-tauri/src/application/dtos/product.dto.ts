/**
 * Data Transfer Objects for Product
 */

import { CategoryDTO, BrandDTO } from './category.dto';

export interface ProductImageDTO {
  id: string;
  productId: string;
  path: string;
  order: number;
  createdAt: string;
}

export interface ProductImageCreateDTO {
  path: string;
  order?: number;
}

export interface MotorcycleCompatibilityDTO {
  id: string;
  productId: string;
  brand: string;
  model: string;
  year: string | null;
  notes: string | null;
}

export interface MotorcycleCompatibilityCreateDTO {
  brand: string;
  model: string;
  year?: string;
  notes?: string;
}

export interface ProductDTO {
  id: string;
  internalCode: string;
  barcode: string | null;
  sku: string | null;
  name: string;
  description: string | null;
  brandId: string;
  brand?: BrandDTO;
  categoryId: string;
  category?: CategoryDTO;
  unit: string;
  stock: number;
  minStock: number;
  maxStock: number | null;
  location: string | null;
  purchasePrice: number;
  salePrice: number;
  supplierId: string | null;
  observations: string | null;
  active: boolean;
  images: ProductImageDTO[];
  compatibilities: MotorcycleCompatibilityDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateDTO {
  internalCode: string;
  barcode?: string;
  sku?: string;
  name: string;
  description?: string;
  brandId: string;
  categoryId: string;
  unit: string;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  location?: string;
  purchasePrice?: number;
  salePrice?: number;
  supplierId?: string;
  observations?: string;
  images?: ProductImageCreateDTO[];
  compatibilities?: MotorcycleCompatibilityCreateDTO[];
}

export interface ProductUpdateDTO {
  id: string;
  internalCode?: string;
  barcode?: string;
  sku?: string;
  name?: string;
  description?: string;
  brandId?: string;
  categoryId?: string;
  unit?: string;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  location?: string;
  purchasePrice?: number;
  salePrice?: number;
  supplierId?: string;
  observations?: string;
  active?: boolean;
  images?: ProductImageCreateDTO[];
  compatibilities?: MotorcycleCompatibilityCreateDTO[];
}
