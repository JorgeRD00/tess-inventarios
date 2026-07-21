import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ProductApiService from '@services/product.api';
import type { Product, ProductCreate, ProductUpdate } from '../types/product.types';

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeProducts = computed(() => products.value.filter(p => p.active));
  const inactiveProducts = computed(() => products.value.filter(p => !p.active));
  const productCount = computed(() => products.value.length);
  const activeProductCount = computed(() => activeProducts.value.length);
  const lowStockProducts = computed(() =>
    products.value.filter(p => p.active && p.stock <= p.minStock)
  );

  // Actions
  /**
   * Load all products
   */
  async function loadProducts(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }) {
    loading.value = true;
    error.value = null;
    try {
      products.value = await ProductApiService.getProducts(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading products';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load product by ID
   */
  async function loadProductById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const product = await ProductApiService.getProductById(id);
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) {
        products.value[index] = product;
      } else {
        products.value.push(product);
      }
      return product;
    } catch (err: any) {
      error.value = err.message || 'Error loading product';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load product by barcode
   */
  async function loadProductByBarcode(barcode: string) {
    loading.value = true;
    error.value = null;
    try {
      const product = await ProductApiService.getProductByBarcode(barcode);
      const index = products.value.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products.value[index] = product;
      } else {
        products.value.push(product);
      }
      return product;
    } catch (err: any) {
      error.value = err.message || 'Error loading product by barcode';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Search products
   */
  async function searchProducts(query: string) {
    loading.value = true;
    error.value = null;
    try {
      products.value = await ProductApiService.searchProducts(query);
      return products.value;
    } catch (err: any) {
      error.value = err.message || 'Error searching products';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new product
   */
  async function createProduct(data: ProductCreate) {
    loading.value = true;
    error.value = null;
    try {
      const product = await ProductApiService.createProduct(data);
      products.value.push(product);
      return product;
    } catch (err: any) {
      error.value = err.message || 'Error creating product';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing product
   */
  async function updateProduct(data: ProductUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const product = await ProductApiService.updateProduct(data);
      const index = products.value.findIndex(p => p.id === data.id);
      if (index !== -1) {
        products.value[index] = product;
      }
      return product;
    } catch (err: any) {
      error.value = err.message || 'Error updating product';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a product
   */
  async function deleteProduct(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await ProductApiService.deleteProduct(id);
      products.value = products.value.filter(p => p.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting product';
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
    products,
    loading,
    error,
    // Getters
    activeProducts,
    inactiveProducts,
    productCount,
    activeProductCount,
    lowStockProducts,
    // Actions
    loadProducts,
    loadProductById,
    loadProductByBarcode,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  };
});
