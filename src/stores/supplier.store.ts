import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SupplierApiService from '@services/supplier.api';
import type { Supplier, SupplierCreate, SupplierUpdate } from '../types/supplier.types';

export const useSupplierStore = defineStore('supplier', () => {
  // State
  const suppliers = ref<Supplier[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeSuppliers = computed(() => suppliers.value.filter(s => s.active));
  const inactiveSuppliers = computed(() => suppliers.value.filter(s => !s.active));
  const supplierCount = computed(() => suppliers.value.length);
  const activeSupplierCount = computed(() => activeSuppliers.value.length);

  // Actions
  /**
   * Load all suppliers
   */
  async function loadSuppliers(filters?: { active?: boolean }) {
    loading.value = true;
    error.value = null;
    try {
      suppliers.value = await SupplierApiService.getSuppliers(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading suppliers';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load supplier by ID
   */
  async function loadSupplierById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const supplier = await SupplierApiService.getSupplierById(id);
      const index = suppliers.value.findIndex(s => s.id === id);
      if (index !== -1) {
        suppliers.value[index] = supplier;
      } else {
        suppliers.value.push(supplier);
      }
      return supplier;
    } catch (err: any) {
      error.value = err.message || 'Error loading supplier';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Search suppliers
   */
  async function searchSuppliers(query: string) {
    loading.value = true;
    error.value = null;
    try {
      suppliers.value = await SupplierApiService.searchSuppliers(query);
      return suppliers.value;
    } catch (err: any) {
      error.value = err.message || 'Error searching suppliers';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new supplier
   */
  async function createSupplier(data: SupplierCreate) {
    loading.value = true;
    error.value = null;
    try {
      const supplier = await SupplierApiService.createSupplier(data);
      suppliers.value.push(supplier);
      return supplier;
    } catch (err: any) {
      error.value = err.message || 'Error creating supplier';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing supplier
   */
  async function updateSupplier(data: SupplierUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const supplier = await SupplierApiService.updateSupplier(data);
      const index = suppliers.value.findIndex(s => s.id === data.id);
      if (index !== -1) {
        suppliers.value[index] = supplier;
      }
      return supplier;
    } catch (err: any) {
      error.value = err.message || 'Error updating supplier';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a supplier
   */
  async function deleteSupplier(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await SupplierApiService.deleteSupplier(id);
      suppliers.value = suppliers.value.filter(s => s.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting supplier';
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
    suppliers,
    loading,
    error,
    // Getters
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
    clearError,
  };
});
