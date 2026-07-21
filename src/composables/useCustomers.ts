import { useCustomerStore } from '@stores/customer.store';
import { storeToRefs } from 'pinia';
import type { CustomerCreate, CustomerUpdate } from '../types/customer.types';

/**
 * Composable for customer operations
 */
export function useCustomers() {
  const customerStore = useCustomerStore();
  const { customers, loading, error, activeCustomers, inactiveCustomers, customerCount, activeCustomerCount } = storeToRefs(customerStore);

  /**
   * Load customers with optional filters
   */
  const loadCustomers = async (filters?: { active?: boolean }) => {
    return await customerStore.loadCustomers(filters);
  };

  /**
   * Load a specific customer by ID
   */
  const loadCustomerById = async (id: string) => {
    return await customerStore.loadCustomerById(id);
  };

  /**
   * Search customers
   */
  const searchCustomers = async (query: string) => {
    return await customerStore.searchCustomers(query);
  };

  /**
   * Create a new customer
   */
  const createCustomer = async (data: CustomerCreate) => {
    return await customerStore.createCustomer(data);
  };

  /**
   * Update an existing customer
   */
  const updateCustomer = async (data: CustomerUpdate) => {
    return await customerStore.updateCustomer(data);
  };

  /**
   * Delete a customer
   */
  const deleteCustomer = async (id: string) => {
    return await customerStore.deleteCustomer(id);
  };

  return {
    // State (refs)
    customers,
    loading,
    error,
    // Getters (refs)
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
    deleteUser: deleteCustomer, // consistent name
    deleteCustomer,
    clearError: customerStore.clearError,
  };
}
