import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PurchaseApiService from '@services/purchase.api';
import type { Purchase, PurchaseCreate, PurchaseUpdate } from '../types/purchase.types';

export const usePurchaseStore = defineStore('purchase', () => {
  // State
  const purchases = ref<Purchase[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const purchaseCount = computed(() => purchases.value.length);
  const totalPurchasesAmount = computed(() =>
    purchases.value.reduce((sum, purchase) => sum + (purchase.total || 0), 0)
  );

  // Actions
  /**
   * Load all purchases
   */
  async function loadPurchases(filters?: {
    supplierId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      purchases.value = await PurchaseApiService.getPurchases(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading purchases';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load purchase by ID
   */
  async function loadPurchaseById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const purchase = await PurchaseApiService.getPurchaseById(id);
      const index = purchases.value.findIndex(p => p.id === id);
      if (index !== -1) {
        purchases.value[index] = purchase;
      } else {
        purchases.value.push(purchase);
      }
      return purchase;
    } catch (err: any) {
      error.value = err.message || 'Error loading purchase';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new purchase
   */
  async function createPurchase(data: PurchaseCreate) {
    loading.value = true;
    error.value = null;
    try {
      const purchase = await PurchaseApiService.createPurchase(data);
      purchases.value.push(purchase);
      return purchase;
    } catch (err: any) {
      error.value = err.message || 'Error creating purchase';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing purchase
   */
  async function updatePurchase(data: PurchaseUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const purchase = await PurchaseApiService.updatePurchase(data);
      const index = purchases.value.findIndex(p => p.id === data.id);
      if (index !== -1) {
        purchases.value[index] = purchase;
      }
      return purchase;
    } catch (err: any) {
      error.value = err.message || 'Error updating purchase';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a purchase
   */
  async function deletePurchase(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await PurchaseApiService.deletePurchase(id);
      purchases.value = purchases.value.filter(p => p.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting purchase';
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
    purchases,
    loading,
    error,
    // Getters
    purchaseCount,
    totalPurchasesAmount,
    // Actions
    loadPurchases,
    loadPurchaseById,
    createPurchase,
    updatePurchase,
    deletePurchase,
    clearError,
  };
});
