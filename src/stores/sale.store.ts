import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SaleApiService from '@services/sale.api';
import type { Sale, SaleCreate, SaleUpdate } from '../types/sale.types';

export const useSaleStore = defineStore('sale', () => {
  // State
  const sales = ref<Sale[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const saleCount = computed(() => sales.value.length);
  const totalSalesAmount = computed(() =>
    sales.value.reduce((sum, sale) => sum + (sale.total || 0), 0)
  );

  // Actions
  /**
   * Load all sales
   */
  async function loadSales(filters?: {
    customerId?: string;
    paymentMethodId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      sales.value = await SaleApiService.getSales(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading sales';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load sale by ID
   */
  async function loadSaleById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const sale = await SaleApiService.getSaleById(id);
      const index = sales.value.findIndex(s => s.id === id);
      if (index !== -1) {
        sales.value[index] = sale;
      } else {
        sales.value.push(sale);
      }
      return sale;
    } catch (err: any) {
      error.value = err.message || 'Error loading sale';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new sale
   */
  async function createSale(data: SaleCreate) {
    loading.value = true;
    error.value = null;
    try {
      const sale = await SaleApiService.createSale(data);
      sales.value.push(sale);
      return sale;
    } catch (err: any) {
      error.value = err.message || 'Error creating sale';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing sale
   */
  async function updateSale(data: SaleUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const sale = await SaleApiService.updateSale(data);
      const index = sales.value.findIndex(s => s.id === data.id);
      if (index !== -1) {
        sales.value[index] = sale;
      }
      return sale;
    } catch (err: any) {
      error.value = err.message || 'Error updating sale';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a sale
   */
  async function deleteSale(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await SaleApiService.deleteSale(id);
      sales.value = sales.value.filter(s => s.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting sale';
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
    sales,
    loading,
    error,
    // Getters
    saleCount,
    totalSalesAmount,
    // Actions
    loadSales,
    loadSaleById,
    createSale,
    updateSale,
    deleteSale,
    clearError,
  };
});
