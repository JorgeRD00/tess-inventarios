import { useCategoryStore } from '@stores/category.store';
import { storeToRefs } from 'pinia';
import type { CategoryCreate, CategoryUpdate, BrandCreate, BrandUpdate } from '../types/category.types';

/**
 * Composable for category operations
 * Provides a convenient interface for working with categories and brands
 */
export function useCategories() {
  const categoryStore = useCategoryStore();
  const {
    categories,
    brands,
    loading,
    error,
    activeCategories,
    inactiveCategories,
    categoryCount,
    activeCategoryCount,
    activeBrands,
    inactiveBrands,
    brandCount,
    activeBrandCount,
  } = storeToRefs(categoryStore);

  /**
   * Load categories with optional filters
   */
  const loadCategories = async (filters?: { active?: boolean }) => {
    return await categoryStore.loadCategories(filters);
  };

  /**
   * Load a specific category by ID
   */
  const loadCategoryById = async (id: string) => {
    return await categoryStore.loadCategoryById(id);
  };

  /**
   * Create a new category
   */
  const createCategory = async (data: CategoryCreate) => {
    return await categoryStore.createCategory(data);
  };

  /**
   * Update an existing category
   */
  const updateCategory = async (data: CategoryUpdate) => {
    return await categoryStore.updateCategory(data);
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id: string) => {
    return await categoryStore.deleteCategory(id);
  };

  /**
   * Load brands with optional filters
   */
  const loadBrands = async (filters?: { active?: boolean }) => {
    return await categoryStore.loadBrands(filters);
  };

  /**
   * Load a specific brand by ID
   */
  const loadBrandById = async (id: string) => {
    return await categoryStore.loadBrandById(id);
  };

  /**
   * Create a new brand
   */
  const createBrand = async (data: BrandCreate) => {
    return await categoryStore.createBrand(data);
  };

  /**
   * Update an existing brand
   */
  const updateBrand = async (data: BrandUpdate) => {
    return await categoryStore.updateBrand(data);
  };

  /**
   * Delete a brand
   */
  const deleteBrand = async (id: string) => {
    return await categoryStore.deleteBrand(id);
  };

  return {
    // State (refs)
    categories,
    brands,
    loading,
    error,
    // Getters (refs)
    activeCategories,
    inactiveCategories,
    categoryCount,
    activeCategoryCount,
    activeBrands,
    inactiveBrands,
    brandCount,
    activeBrandCount,
    // Actions
    loadCategories,
    loadCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    loadBrands,
    loadBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    clearError: categoryStore.clearError,
  };
}
