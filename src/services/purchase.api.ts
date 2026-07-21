import ApiService from './api.service';
import type { Purchase, PurchaseCreate, PurchaseUpdate } from '../types/purchase.types';

/**
 * API service for Purchase operations
 * Communicates with Tauri commands
 */
export class PurchaseApiService {
  /**
   * Get all purchases
   */
  static async getPurchases(filters?: {
    supplierId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Purchase[]> {
    return ApiService.invoke<Purchase[]>('get_purchases', { filters });
  }

  /**
   * Get purchase by ID
   */
  static async getPurchaseById(id: string): Promise<Purchase> {
    return ApiService.invoke<Purchase>('get_purchase_by_id', { id });
  }

  /**
   * Get purchase by folio
   */
  static async getPurchaseByFolio(folio: string): Promise<Purchase> {
    return ApiService.invoke<Purchase>('get_purchase_by_folio', { folio });
  }

  /**
   * Create a new purchase
   */
  static async createPurchase(data: PurchaseCreate): Promise<Purchase> {
    return ApiService.invoke<Purchase>('create_purchase', { data });
  }

  /**
   * Update an existing purchase
   */
  static async updatePurchase(data: PurchaseUpdate): Promise<Purchase> {
    return ApiService.invoke<Purchase>('update_purchase', { data });
  }

  /**
   * Delete a purchase
   */
  static async deletePurchase(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_purchase', { id });
  }
}

export default PurchaseApiService;
