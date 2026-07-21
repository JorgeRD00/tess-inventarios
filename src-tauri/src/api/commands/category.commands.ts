import { CategoryService } from '@application/services/category.service';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { BrandRepository } from '@infrastructure/repositories/brand.repository';
import {
  CategoryDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
  BrandDTO,
  BrandCreateDTO,
  BrandUpdateDTO,
} from '@application/dtos/category.dto';

/**
 * Initialize repositories and service
 */
const categoryRepository = new CategoryRepository();
const brandRepository = new BrandRepository();
const categoryService = new CategoryService(
  categoryRepository,
  brandRepository
);

/**
 * Tauri commands for Category and Brand operations
 */

// ============================================
// CATEGORY COMMANDS
// ============================================

/**
 * Get all categories
 */
export async function getCategories(filters?: {
  active?: boolean;
}): Promise<CategoryDTO[]> {
  try {
    return await categoryService.getCategories(filters);
  } catch (error) {
    console.error('Error in getCategories command:', error);
    throw error;
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<CategoryDTO> {
  try {
    return await categoryService.getCategoryById(id);
  } catch (error) {
    console.error('Error in getCategoryById command:', error);
    throw error;
  }
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryCreateDTO): Promise<CategoryDTO> {
  try {
    return await categoryService.createCategory(data);
  } catch (error) {
    console.error('Error in createCategory command:', error);
    throw error;
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(data: CategoryUpdateDTO): Promise<CategoryDTO> {
  try {
    return await categoryService.updateCategory(data);
  } catch (error) {
    console.error('Error in updateCategory command:', error);
    throw error;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    await categoryService.deleteCategory(id);
  } catch (error) {
    console.error('Error in deleteCategory command:', error);
    throw error;
  }
}

// ============================================
// BRAND COMMANDS
// ============================================

/**
 * Get all brands
 */
export async function getBrands(filters?: {
  active?: boolean;
}): Promise<BrandDTO[]> {
  try {
    return await categoryService.getBrands(filters);
  } catch (error) {
    console.error('Error in getBrands command:', error);
    throw error;
  }
}

/**
 * Get brand by ID
 */
export async function getBrandById(id: string): Promise<BrandDTO> {
  try {
    return await categoryService.getBrandById(id);
  } catch (error) {
    console.error('Error in getBrandById command:', error);
    throw error;
  }
}

/**
 * Create a new brand
 */
export async function createBrand(data: BrandCreateDTO): Promise<BrandDTO> {
  try {
    return await categoryService.createBrand(data);
  } catch (error) {
    console.error('Error in createBrand command:', error);
    throw error;
  }
}

/**
 * Update an existing brand
 */
export async function updateBrand(data: BrandUpdateDTO): Promise<BrandDTO> {
  try {
    return await categoryService.updateBrand(data);
  } catch (error) {
    console.error('Error in updateBrand command:', error);
    throw error;
  }
}

/**
 * Delete a brand
 */
export async function deleteBrand(id: string): Promise<void> {
  try {
    await categoryService.deleteBrand(id);
  } catch (error) {
    console.error('Error in deleteBrand command:', error);
    throw error;
  }
}
