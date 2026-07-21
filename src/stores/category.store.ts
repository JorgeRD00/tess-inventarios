import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CategoryApiService from '@services/category.api';
import type { Category, CategoryCreate, CategoryUpdate, Brand, BrandCreate, BrandUpdate } from '../types/category.types';

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([]);
  const brands = ref<Brand[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeCategories = computed(() => categories.value.filter(c => c.active));
  const inactiveCategories = computed(() => categories.value.filter(c => !c.active));
  const categoryCount = computed(() => categories.value.length);
  const activeCategoryCount = computed(() => activeCategories.value.length);
  
  const activeBrands = computed(() => brands.value.filter(b => b.active));
  const inactiveBrands = computed(() => brands.value.filter(b => !b.active));
  const brandCount = computed(() => brands.value.length);
  const activeBrandCount = computed(() => activeBrands.value.length);

  // Actions
  /**
   * Load all categories
   */
  async function loadCategories(filters?: { active?: boolean }) {
    loading.value = true;
    error.value = null;
    try {
      categories.value = await CategoryApiService.getCategories(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading categories';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load category by ID
   */
  async function loadCategoryById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const category = await CategoryApiService.getCategoryById(id);
      const index = categories.value.findIndex(c => c.id === id);
      if (index !== -1) {
        categories.value[index] = category;
      } else {
        categories.value.push(category);
      }
      return category;
    } catch (err: any) {
      error.value = err.message || 'Error loading category';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new category
   */
  async function createCategory(data: CategoryCreate) {
    loading.value = true;
    error.value = null;
    try {
      const category = await CategoryApiService.createCategory(data);
      categories.value.push(category);
      return category;
    } catch (err: any) {
      error.value = err.message || 'Error creating category';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing category
   */
  async function updateCategory(data: CategoryUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const category = await CategoryApiService.updateCategory(data);
      const index = categories.value.findIndex(c => c.id === data.id);
      if (index !== -1) {
        categories.value[index] = category;
      }
      return category;
    } catch (err: any) {
      error.value = err.message || 'Error updating category';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a category
   */
  async function deleteCategory(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await CategoryApiService.deleteCategory(id);
      categories.value = categories.value.filter(c => c.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting category';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load all brands
   */
  async function loadBrands(filters?: { active?: boolean }) {
    loading.value = true;
    error.value = null;
    try {
      brands.value = await CategoryApiService.getBrands(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading brands';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load brand by ID
   */
  async function loadBrandById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const brand = await CategoryApiService.getBrandById(id);
      const index = brands.value.findIndex(b => b.id === id);
      if (index !== -1) {
        brands.value[index] = brand;
      } else {
        brands.value.push(brand);
      }
      return brand;
    } catch (err: any) {
      error.value = err.message || 'Error loading brand';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new brand
   */
  async function createBrand(data: BrandCreate) {
    loading.value = true;
    error.value = null;
    try {
      const brand = await CategoryApiService.createBrand(data);
      brands.value.push(brand);
      return brand;
    } catch (err: any) {
      error.value = err.message || 'Error creating brand';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing brand
   */
  async function updateBrand(data: BrandUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const brand = await CategoryApiService.updateBrand(data);
      const index = brands.value.findIndex(b => b.id === data.id);
      if (index !== -1) {
        brands.value[index] = brand;
      }
      return brand;
    } catch (err: any) {
      error.value = err.message || 'Error updating brand';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a brand
   */
  async function deleteBrand(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await CategoryApiService.deleteBrand(id);
      brands.value = brands.value.filter(b => b.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting brand';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null;
  }

  return {
    // State
    categories,
    brands,
    loading,
    error,
    // Getters
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
    clearError,
  };
});
