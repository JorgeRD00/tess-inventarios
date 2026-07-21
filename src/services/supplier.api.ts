import ApiService from './api.service';
import type {
  Supplier,
  SupplierCreate,
  SupplierUpdate,
} from '../types/supplier.types';

/**
 * API service for Supplier operations
 * Communicates with Tauri commands
 */
export class SupplierApiService {
  /**
   * Get all suppliers
   */
  static async getSuppliers(filters?: {
    active?: boolean;
  }): Promise<Supplier[]> {
    return ApiService.invoke<Supplier[]>('get_suppliers', { filters });
  }

  /**
   * Get supplier by ID
   */
  static async getSupplierById(id: string): Promise<Supplier> {
    return ApiService.invoke<Supplier>('get_supplier_by_id', { id });
  }

  /**
   * Search suppliers
   */
  static async searchSuppliers(query: string): Promise<Supplier[]> {
    return ApiService.invoke<Supplier[]>('search_suppliers', { query });
  }

  /**
   * Create a new supplier
   */
  static async createSupplier(data: SupplierCreate): Promise<Supplier> {
    return ApiService.invoke<Supplier>('create_supplier', { data });
  }

  /**
   * Update an existing supplier
   */
  static async updateSupplier(data: SupplierUpdate): Promise<Supplier> {
    return ApiService.invoke<Supplier>('update_supplier', { data });
  }

  /**
   * Delete a supplier
   */
  static async deleteSupplier(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_supplier', { id });
  }
}

export default SupplierApiService;
