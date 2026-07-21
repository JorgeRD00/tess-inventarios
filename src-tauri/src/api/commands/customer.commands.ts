import { CustomerService } from '@application/services/customer.service';
import { CustomerRepository } from '@infrastructure/repositories/customer.repository';
import {
  CustomerDTO,
  CustomerCreateDTO,
  CustomerUpdateDTO,
} from '@application/dtos/customer.dto';

/**
 * Initialize repositories and service
 */
const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);

/**
 * Tauri commands for Customer operations
 */

// ============================================
// CUSTOMER COMMANDS
// ============================================

/**
 * Get all customers
 */
export async function getCustomers(filters?: {
  active?: boolean;
}): Promise<CustomerDTO[]> {
  try {
    return await customerService.getCustomers(filters);
  } catch (error) {
    console.error('Error in getCustomers command:', error);
    throw error;
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerDTO> {
  try {
    return await customerService.getCustomerById(id);
  } catch (error) {
    console.error('Error in getCustomerById command:', error);
    throw error;
  }
}

/**
 * Search customers
 */
export async function searchCustomers(query: string): Promise<CustomerDTO[]> {
  try {
    return await customerService.searchCustomers(query);
  } catch (error) {
    console.error('Error in searchCustomers command:', error);
    throw error;
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(data: CustomerCreateDTO): Promise<CustomerDTO> {
  try {
    return await customerService.createCustomer(data);
  } catch (error) {
    console.error('Error in createCustomer command:', error);
    throw error;
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(data: CustomerUpdateDTO): Promise<CustomerDTO> {
  try {
    return await customerService.updateCustomer(data);
  } catch (error) {
    console.error('Error in updateCustomer command:', error);
    throw error;
  }
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<void> {
  try {
    await customerService.deleteCustomer(id);
  } catch (error) {
    console.error('Error in deleteCustomer command:', error);
    throw error;
  }
}
