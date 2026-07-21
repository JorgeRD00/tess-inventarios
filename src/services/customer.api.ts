import ApiService from './api.service';
import type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
} from '../types/customer.types';

/**
 * API service for Customer operations
 * Communicates with Tauri commands
 */
export class CustomerApiService {
  /**
   * Get all customers
   */
  static async getCustomers(filters?: {
    active?: boolean;
  }): Promise<Customer[]> {
    return ApiService.invoke<Customer[]>('get_customers', { filters });
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(id: string): Promise<Customer> {
    return ApiService.invoke<Customer>('get_customer_by_id', { id });
  }

  /**
   * Search customers
   */
  static async searchCustomers(query: string): Promise<Customer[]> {
    return ApiService.invoke<Customer[]>('search_customers', { query });
  }

  /**
   * Create a new customer
   */
  static async createCustomer(data: CustomerCreate): Promise<Customer> {
    return ApiService.invoke<Customer>('create_customer', { data });
  }

  /**
   * Update an existing customer
   */
  static async updateCustomer(data: CustomerUpdate): Promise<Customer> {
    return ApiService.invoke<Customer>('update_customer', { data });
  }

  /**
   * Delete a customer
   */
  static async deleteCustomer(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_customer', { id });
  }
}

export default CustomerApiService;
