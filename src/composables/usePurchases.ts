import { usePurchaseStore } from '@stores/purchase.store';
import { storeToRefs } from 'pinia';
import type { PurchaseCreate, PurchaseUpdate } from '../types/purchase.types';

/**
 * Composable for purchase operations
 */
export function usePurchases() {
  const purchaseStore = usePurchaseStore();
  const { purchases, loading, error, purchaseCount, totalPurchasesAmount } = storeToRefs(purchaseStore);

  /**
   * Load purchases with optional filters
   */
  const loadPurchases = async (filters?: {
    supplierId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return await purchaseStore.loadPurchases(filters);
  };

  /**
   * Load a specific purchase by ID
   */
  const loadPurchaseById = async (id: string) => {
    return await purchaseStore.loadPurchaseById(id);
  };

  /**
   * Create a new purchase
   */
  const createPurchase = async (data: PurchaseCreate) => {
    return await purchaseStore.createPurchase(data);
  };

  /**
   * Update an existing purchase
   */
  const updatePurchase = async (data: PurchaseUpdate) => {
    return await purchaseStore.updatePurchase(data);
  };

  /**
   * Delete a purchase
   */
  const deletePurchase = async (id: string) => {
    return await purchaseStore.deletePurchase(id);
  };

  return {
    // State (refs)
    purchases,
    loading,
    error,
    // Getters (refs)
    purchaseCount,
    totalPurchasesAmount,
    // Actions
    loadPurchases,
    loadPurchaseById,
    createPurchase,
    updatePurchase,
    deletePurchase,
    clearError: purchaseStore.clearError,
  };
}
