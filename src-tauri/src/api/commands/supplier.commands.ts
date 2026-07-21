import { SupplierService } from '@application/services/supplier.service';
import { SupplierRepository } from '@infrastructure/repositories/supplier.repository';
import {
  SupplierDTO,
  SupplierCreateDTO,
  SupplierUpdateDTO,
} from '@application/dtos/supplier.dto';

/**
 * Initialize repositories and service
 */
const supplierRepository = new SupplierRepository();
const supplierService = new SupplierService(supplierRepository);

/**
 * Tauri commands for Supplier operations
 */

// ============================================
// SUPPLIER COMMANDS
// ============================================

/**
 * Get all suppliers
 */
export async function getSuppliers(filters?: {
  active?: boolean;
}): Promise<SupplierDTO[]> {
  try {
    return await supplierService.getSuppliers(filters);
  } catch (error) {
    console.error('Error in getSuppliers command:', error);
    throw error;
  }
}

/**
 * Get supplier by ID
 */
export async function getSupplierById(id: string): Promise<SupplierDTO> {
  try {
    return await supplierService.getSupplierById(id);
  } catch (error) {
    console.error('Error in getSupplierById command:', error);
    throw error;
  }
}

/**
 * Search suppliers
 */
export async function searchSuppliers(query: string): Promise<SupplierDTO[]> {
  try {
    return await supplierService.searchSuppliers(query);
  } catch (error) {
    console.error('Error in searchSuppliers command:', error);
    throw error;
  }
}

/**
 * Create a new supplier
 */
export async function createSupplier(data: SupplierCreateDTO): Promise<SupplierDTO> {
  try {
    return await supplierService.createSupplier(data);
  } catch (error) {
    console.error('Error in createSupplier command:', error);
    throw error;
  }
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(data: SupplierUpdateDTO): Promise<SupplierDTO> {
  try {
    return await supplierService.updateSupplier(data);
  } catch (error) {
    console.error('Error in updateSupplier command:', error);
    throw error;
  }
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(id: string): Promise<void> {
  try {
    await supplierService.deleteSupplier(id);
  } catch (error) {
    console.error('Error in deleteSupplier command:', error);
    throw error;
  }
}
