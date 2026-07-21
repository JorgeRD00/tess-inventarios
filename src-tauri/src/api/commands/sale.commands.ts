import { SaleService } from '@application/services/sale.service';
import { SaleRepository } from '@infrastructure/repositories/sale.repository';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import prisma from '@infrastructure/database/client';
import {
  SaleDTO,
  SaleCreateDTO,
  SaleUpdateDTO,
} from '@application/dtos/sale.dto';

/**
 * Initialize repositories and service
 */
const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();
const saleService = new SaleService(saleRepository, productRepository);

/**
 * Tauri commands for Sale operations
 */

// ============================================
// SALE COMMANDS
// ============================================

/**
 * Get all sales
 */
export async function getSales(filters?: {
  customerId?: string;
  paymentMethodId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<SaleDTO[]> {
  try {
    return await saleService.getSales(filters);
  } catch (error) {
    console.error('Error in getSales command:', error);
    throw error;
  }
}

/**
 * Get sale by ID
 */
export async function getSaleById(id: string): Promise<SaleDTO> {
  try {
    return await saleService.getSaleById(id);
  } catch (error) {
    console.error('Error in getSaleById command:', error);
    throw error;
  }
}

/**
 * Get sale by folio
 */
export async function getSaleByFolio(folio: string): Promise<SaleDTO> {
  try {
    return await saleService.getSaleByFolio(folio);
  } catch (error) {
    console.error('Error in getSaleByFolio command:', error);
    throw error;
  }
}

/**
 * Create a new sale
 */
export async function createSale(data: SaleCreateDTO): Promise<SaleDTO> {
  try {
    return await saleService.createSale(data);
  } catch (error) {
    console.error('Error in createSale command:', error);
    throw error;
  }
}

/**
 * Update an existing sale
 */
export async function updateSale(data: SaleUpdateDTO): Promise<SaleDTO> {
  try {
    return await saleService.updateSale(data);
  } catch (error) {
    console.error('Error in updateSale command:', error);
    throw error;
  }
}

/**
 * Delete a sale
 */
export async function deleteSale(id: string): Promise<void> {
  try {
    await saleService.deleteSale(id);
  } catch (error) {
    console.error('Error in deleteSale command:', error);
    throw error;
  }
}

// ============================================
// PAYMENT METHOD COMMANDS
// ============================================

/**
 * Get all payment methods
 */
export async function getPaymentMethods(): Promise<{ id: string; name: string }[]> {
  try {
    return await prisma.paymentMethod.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error in getPaymentMethods command:', error);
    throw error;
  }
}
