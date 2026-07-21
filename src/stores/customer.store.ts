import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CustomerApiService from '@services/customer.api';
import type { Customer, CustomerCreate, CustomerUpdate } from '../types/customer.types';

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref<Customer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeCustomers = computed(() => customers.value.filter(c => c.active));
  const inactiveCustomers = computed(() => customers.value.filter(c => !c.active));
  const customerCount = computed(() => customers.value.length);
  const activeCustomerCount = computed(() => activeCustomers.value.length);

  // Actions
  /**
   * Load all customers
   */
  async function loadCustomers(filters?: { active?: boolean }) {
    loading.value = true;
    error.value = null;
    try {
      customers.value = await CustomerApiService.getCustomers(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading customers';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load customer by ID
   */
  async function loadCustomerById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const customer = await CustomerApiService.getCustomerById(id);
      const index = customers.value.findIndex(c => c.id === id);
      if (index !== -1) {
        customers.value[index] = customer;
      } else {
        customers.value.push(customer);
      }
      return customer;
    } catch (err: any) {
      error.value = err.message || 'Error loading customer';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Search customers
   */
  async function searchCustomers(query: string) {
    loading.value = true;
    error.value = null;
    try {
      customers.value = await CustomerApiService.searchCustomers(query);
      return customers.value;
    } catch (err: any) {
      error.value = err.message || 'Error searching customers';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new customer
   */
  async function createCustomer(data: CustomerCreate) {
    loading.value = true;
    error.value = null;
    try {
      const customer = await CustomerApiService.createCustomer(data);
      customers.value.push(customer);
      return customer;
    } catch (err: any) {
      error.value = err.message || 'Error creating customer';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing customer
   */
  async function updateCustomer(data: CustomerUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const customer = await CustomerApiService.updateCustomer(data);
      const index = customers.value.findIndex(c => c.id === data.id);
      if (index !== -1) {
        customers.value[index] = customer;
      }
      return customer;
    } catch (err: any) {
      error.value = err.message || 'Error updating customer';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a customer
   */
  async function deleteCustomer(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await CustomerApiService.deleteCustomer(id);
      customers.value = customers.value.filter(c => c.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting customer';
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
    customers,
    loading,
    error,
    // Getters
    activeCustomers,
    inactiveCustomers,
    customerCount,
    activeCustomerCount,
    // Actions
    loadCustomers,
    loadCustomerById,
    searchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearError,
  };
});
