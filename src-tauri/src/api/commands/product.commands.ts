import { ProductService } from '@application/services/product.service';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import {
  ProductDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
} from '@application/dtos/product.dto';

/**
 * Initialize repositories and service
 */
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

/**
 * Tauri commands for Product operations
 */

// ============================================
// PRODUCT COMMANDS
// ============================================

/**
 * Get all products
 */
export async function getProducts(filters?: {
  active?: boolean;
  brandId?: string;
  categoryId?: string;
  supplierId?: string;
  lowStock?: boolean;
}): Promise<ProductDTO[]> {
  try {
    return await productService.getProducts(filters);
  } catch (error) {
    console.error('Error in getProducts command:', error);
    throw error;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<ProductDTO> {
  try {
    return await productService.getProductById(id);
  } catch (error) {
    console.error('Error in getProductById command:', error);
    throw error;
  }
}

/**
 * Get product by barcode
 */
export async function getProductByBarcode(barcode: string): Promise<ProductDTO> {
  try {
    return await productService.getProductByBarcode(barcode);
  } catch (error) {
    console.error('Error in getProductByBarcode command:', error);
    throw error;
  }
}

/**
 * Get product by internal code
 */
export async function getProductByInternalCode(internalCode: string): Promise<ProductDTO> {
  try {
    return await productService.getProductByInternalCode(internalCode);
  } catch (error) {
    console.error('Error in getProductByInternalCode command:', error);
    throw error;
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<ProductDTO[]> {
  try {
    return await productService.searchProducts(query);
  } catch (error) {
    console.error('Error in searchProducts command:', error);
    throw error;
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductCreateDTO): Promise<ProductDTO> {
  try {
    return await productService.createProduct(data);
  } catch (error) {
    console.error('Error in createProduct command:', error);
    throw error;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(data: ProductUpdateDTO): Promise<ProductDTO> {
  try {
    return await productService.updateProduct(data);
  } catch (error) {
    console.error('Error in updateProduct command:', error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    await productService.deleteProduct(id);
  } catch (error) {
    console.error('Error in deleteProduct command:', error);
    throw error;
  }
}
