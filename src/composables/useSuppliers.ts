import { useSupplierStore } from '@stores/supplier.store';
import { storeToRefs } from 'pinia';
import type { SupplierCreate, SupplierUpdate } from '../types/supplier.types';

/**
 * Composable for supplier operations
 */
export function useSuppliers() {
  const supplierStore = useSupplierStore();
  const { suppliers, loading, error, activeSuppliers, inactiveSuppliers, supplierCount, activeSupplierCount } = storeToRefs(supplierStore);

  /**
   * Load suppliers with optional filters
   */
  const loadSuppliers = async (filters?: { active?: boolean }) => {
    return await supplierStore.loadSuppliers(filters);
  };

  /**
   * Load a specific supplier by ID
   */
  const loadSupplierById = async (id: string) => {
    return await supplierStore.loadSupplierById(id);
  };

  /**
   * Search suppliers
   */
  const searchSuppliers = async (query: string) => {
    return await supplierStore.searchSuppliers(query);
  };

  /**
   * Create a new supplier
   */
  const createSupplier = async (data: SupplierCreate) => {
    return await supplierStore.createSupplier(data);
  };

  /**
   * Update an existing supplier
   */
  const updateSupplier = async (data: SupplierUpdate) => {
    return await supplierStore.updateSupplier(data);
  };

  /**
   * Delete a supplier
   */
  const deleteSupplier = async (id: string) => {
    return await supplierStore.deleteSupplier(id);
  };

  return {
    // State (refs)
    suppliers,
    loading,
    error,
    // Getters (refs)
    activeSuppliers,
    inactiveSuppliers,
    supplierCount,
    activeSupplierCount,
    // Actions
    loadSuppliers,
    loadSupplierById,
    searchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    clearError: supplierStore.clearError,
  };
}
