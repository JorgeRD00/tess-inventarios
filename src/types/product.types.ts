/**
 * Product types for frontend
 */

import type { Brand, Category } from './category.types';
import type { Supplier } from './supplier.types';

export interface ProductImage {
  id: string
  productId: string
  path: string
  order: number
  createdAt: string
}

export interface ProductImageCreate {
  path: string
  order?: number
}

export interface MotorcycleCompatibility {
  id: string
  productId: string
  brand: string
  model: string
  year: string | null
  notes: string | null
}

export interface MotorcycleCompatibilityCreate {
  brand: string
  model: string
  year?: string
  notes?: string
}

export interface Product {
  id: string
  internalCode: string
  barcode: string | null
  sku: string | null
  name: string
  description: string | null
  brandId: string
  brand?: Brand
  categoryId: string
  category?: Category
  unit: string
  stock: number
  minStock: number
  maxStock: number | null
  location: string | null
  purchasePrice: number
  salePrice: number
  supplierId: string | null
  supplier?: Supplier
  observations: string | null
  active: boolean
  images: ProductImage[]
  compatibilities: MotorcycleCompatibility[]
  createdAt: string
  updatedAt: string
}

export interface ProductCreate {
  internalCode: string
  barcode?: string
  sku?: string
  name: string
  description?: string
  brandId: string
  categoryId: string
  unit: string
  stock?: number
  minStock?: number
  maxStock?: number
  location?: string
  purchasePrice?: number
  salePrice?: number
  supplierId?: string
  observations?: string
  images?: ProductImageCreate[]
  compatibilities?: MotorcycleCompatibilityCreate[]
}

export interface ProductUpdate {
  id: string
  internalCode?: string
  barcode?: string
  sku?: string
  name?: string
  description?: string
  brandId?: string
  categoryId?: string
  unit?: string
  stock?: number
  minStock?: number
  maxStock?: number
  location?: string
  purchasePrice?: number
  salePrice?: number
  supplierId?: string
  observations?: string
  active?: boolean
  images?: ProductImageCreate[]
  compatibilities?: MotorcycleCompatibilityCreate[]
}
