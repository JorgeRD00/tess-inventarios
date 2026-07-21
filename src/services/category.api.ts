import ApiService from './api.service';
import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
  Brand,
  BrandCreate,
  BrandUpdate,
} from '../types/category.types';

/**
 * API service for Category and Brand operations
 * Communicates with Tauri commands
 */
export class CategoryApiService {
  // ============================================
  // CATEGORY OPERATIONS
  // ============================================

  /**
   * Get all categories
   */
  static async getCategories(filters?: {
    active?: boolean;
  }): Promise<Category[]> {
    return ApiService.invoke<Category[]>('get_categories', { filters });
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<Category> {
    return ApiService.invoke<Category>('get_category_by_id', { id });
  }

  /**
   * Create a new category
   */
  static async createCategory(data: CategoryCreate): Promise<Category> {
    return ApiService.invoke<Category>('create_category', { data });
  }

  /**
   * Update an existing category
   */
  static async updateCategory(data: CategoryUpdate): Promise<Category> {
    return ApiService.invoke<Category>('update_category', { data });
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_category', { id });
  }

  // ============================================
  // BRAND OPERATIONS
  // ============================================

  /**
   * Get all brands
   */
  static async getBrands(filters?: {
    active?: boolean;
  }): Promise<Brand[]> {
    return ApiService.invoke<Brand[]>('get_brands', { filters });
  }

  /**
   * Get brand by ID
   */
  static async getBrandById(id: string): Promise<Brand> {
    return ApiService.invoke<Brand>('get_brand_by_id', { id });
  }

  /**
   * Create a new brand
   */
  static async createBrand(data: BrandCreate): Promise<Brand> {
    return ApiService.invoke<Brand>('create_brand', { data });
  }

  /**
   * Update an existing brand
   */
  static async updateBrand(data: BrandUpdate): Promise<Brand> {
    return ApiService.invoke<Brand>('update_brand', { data });
  }

  /**
   * Delete a brand
   */
  static async deleteBrand(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_brand', { id });
  }
}

export default CategoryApiService;
