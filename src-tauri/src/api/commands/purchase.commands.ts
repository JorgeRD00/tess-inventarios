import { PurchaseService } from '@application/services/purchase.service';
import { PurchaseRepository } from '@infrastructure/repositories/purchase.repository';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import {
  PurchaseDTO,
  PurchaseCreateDTO,
  PurchaseUpdateDTO,
} from '@application/dtos/purchase.dto';

/**
 * Initialize repositories and service
 */
const purchaseRepository = new PurchaseRepository();
const productRepository = new ProductRepository();
const purchaseService = new PurchaseService(purchaseRepository, productRepository);

/**
 * Tauri commands for Purchase operations
 */

// ============================================
// PURCHASE COMMANDS
// ============================================

/**
 * Get all purchases
 */
export async function getPurchases(filters?: {
  supplierId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PurchaseDTO[]> {
  try {
    return await purchaseService.getPurchases(filters);
  } catch (error) {
    console.error('Error in getPurchases command:', error);
    throw error;
  }
}

/**
 * Get purchase by ID
 */
export async function getPurchaseById(id: string): Promise<PurchaseDTO> {
  try {
    return await purchaseService.getPurchaseById(id);
  } catch (error) {
    console.error('Error in getPurchaseById command:', error);
    throw error;
  }
}

/**
 * Get purchase by folio
 */
export async function getPurchaseByFolio(folio: string): Promise<PurchaseDTO> {
  try {
    return await purchaseService.getPurchaseByFolio(folio);
  } catch (error) {
    console.error('Error in getPurchaseByFolio command:', error);
    throw error;
  }
}

/**
 * Create a new purchase
 */
export async function createPurchase(data: PurchaseCreateDTO): Promise<PurchaseDTO> {
  try {
    return await purchaseService.createPurchase(data);
  } catch (error) {
    console.error('Error in createPurchase command:', error);
    throw error;
  }
}

/**
 * Update an existing purchase
 */
export async function updatePurchase(data: PurchaseUpdateDTO): Promise<PurchaseDTO> {
  try {
    return await purchaseService.updatePurchase(data);
  } catch (error) {
    console.error('Error in updatePurchase command:', error);
    throw error;
  }
}

/**
 * Delete a purchase
 */
export async function deletePurchase(id: string): Promise<void> {
  try {
    await purchaseService.deletePurchase(id);
  } catch (error) {
    console.error('Error in deletePurchase command:', error);
    throw error;
  }
}
