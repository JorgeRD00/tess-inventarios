import ApiService from './api.service';
import type { Sale, SaleCreate, SaleUpdate } from '../types/sale.types';

export interface PaymentMethod {
  id: string;
  name: string;
}

/**
 * API service for Sale operations
 * Communicates with Tauri commands
 */
export class SaleApiService {
  /**
   * Get all sales
   */
  static async getSales(filters?: {
    customerId?: string;
    paymentMethodId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Sale[]> {
    return ApiService.invoke<Sale[]>('get_sales', { filters });
  }

  /**
   * Get sale by ID
   */
  static async getSaleById(id: string): Promise<Sale> {
    return ApiService.invoke<Sale>('get_sale_by_id', { id });
  }

  /**
   * Get sale by folio
   */
  static async getSaleByFolio(folio: string): Promise<Sale> {
    return ApiService.invoke<Sale>('get_sale_by_folio', { folio });
  }

  /**
   * Create a new sale
   */
  static async createSale(data: SaleCreate): Promise<Sale> {
    return ApiService.invoke<Sale>('create_sale', { data });
  }

  /**
   * Update an existing sale
   */
  static async updateSale(data: SaleUpdate): Promise<Sale> {
    return ApiService.invoke<Sale>('update_sale', { data });
  }

  /**
   * Delete a sale
   */
  static async deleteSale(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_sale', { id });
  }

  /**
   * Get all payment methods
   */
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    return ApiService.invoke<PaymentMethod[]>('get_payment_methods', {});
  }
}

export default SaleApiService;
