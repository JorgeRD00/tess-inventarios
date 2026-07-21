import { useProductStore } from '@stores/product.store';
import { storeToRefs } from 'pinia';
import type { ProductCreate, ProductUpdate } from '../types/product.types';

/**
 * Composable for product operations
 */
export function useProducts() {
  const productStore = useProductStore();
  const { products, loading, error, activeProducts, inactiveProducts, productCount, activeProductCount, lowStockProducts } = storeToRefs(productStore);

  /**
   * Load products with optional filters
   */
  const loadProducts = async (filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }) => {
    return await productStore.loadProducts(filters);
  };

  /**
   * Load a specific product by ID
   */
  const loadProductById = async (id: string) => {
    return await productStore.loadProductById(id);
  };

  /**
   * Load product by barcode
   */
  const loadProductByBarcode = async (barcode: string) => {
    return await productStore.loadProductByBarcode(barcode);
  };

  /**
   * Search products
   */
  const searchProducts = async (query: string) => {
    return await productStore.searchProducts(query);
  };

  /**
   * Create a new product
   */
  const createProduct = async (data: ProductCreate) => {
    return await productStore.createProduct(data);
  };

  /**
   * Update an existing product
   */
  const updateProduct = async (data: ProductUpdate) => {
    return await productStore.updateProduct(data);
  };

  /**
   * Delete a product
   */
  const deleteProduct = async (id: string) => {
    return await productStore.deleteProduct(id);
  };

  return {
    // State (refs)
    products,
    loading,
    error,
    // Getters (refs)
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
    clearError: productStore.clearError,
  };
}
