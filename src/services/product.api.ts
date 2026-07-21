import ApiService from './api.service';
import type { Product, ProductCreate, ProductUpdate } from '../types/product.types';

/**
 * API service for Product operations
 * Communicates with Tauri commands
 */
export class ProductApiService {
  /**
   * Get all products
   */
  static async getProducts(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }): Promise<Product[]> {
    return ApiService.invoke<Product[]>('get_products', { filters });
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product> {
    return ApiService.invoke<Product>('get_product_by_id', { id });
  }

  /**
   * Get product by barcode
   */
  static async getProductByBarcode(barcode: string): Promise<Product> {
    return ApiService.invoke<Product>('get_product_by_barcode', { barcode });
  }

  /**
   * Get product by internal code
   */
  static async getProductByInternalCode(internalCode: string): Promise<Product> {
    return ApiService.invoke<Product>('get_product_by_internal_code', { internalCode });
  }

  /**
   * Search products
   */
  static async searchProducts(query: string): Promise<Product[]> {
    return ApiService.invoke<Product[]>('search_products', { query });
  }

  /**
   * Create a new product
   */
  static async createProduct(data: ProductCreate): Promise<Product> {
    return ApiService.invoke<Product>('create_product', { data });
  }

  /**
   * Update an existing product
   */
  static async updateProduct(data: ProductUpdate): Promise<Product> {
    return ApiService.invoke<Product>('update_product', { data });
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_product', { id });
  }
}

export default ProductApiService;
