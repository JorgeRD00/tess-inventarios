import { useSaleStore } from '@stores/sale.store';
import { storeToRefs } from 'pinia';
import type { SaleCreate, SaleUpdate } from '../types/sale.types';

/**
 * Composable for sale operations
 */
export function useSales() {
  const saleStore = useSaleStore();
  const { sales, loading, error, saleCount, totalSalesAmount } = storeToRefs(saleStore);

  /**
   * Load sales with optional filters
   */
  const loadSales = async (filters?: {
    customerId?: string;
    paymentMethodId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return await saleStore.loadSales(filters);
  };

  /**
   * Load a specific sale by ID
   */
  const loadSaleById = async (id: string) => {
    return await saleStore.loadSaleById(id);
  };

  /**
   * Create a new sale
   */
  const createSale = async (data: SaleCreate) => {
    return await saleStore.createSale(data);
  };

  /**
   * Update an existing sale
   */
  const updateSale = async (data: SaleUpdate) => {
    return await saleStore.updateSale(data);
  };

  /**
   * Delete a sale
   */
  const deleteSale = async (id: string) => {
    return await saleStore.deleteSale(id);
  };

  return {
    // State (refs)
    sales,
    loading,
    error,
    // Getters (refs)
    saleCount,
    totalSalesAmount,
    // Actions
    loadSales,
    loadSaleById,
    createSale,
    updateSale,
    deleteSale,
    clearError: saleStore.clearError,
  };
}
