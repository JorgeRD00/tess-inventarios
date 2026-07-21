/**
 * Main entry point for Tauri backend (Node.js)
 * This file will be used to register Tauri commands
 */

// Import commands from each module
import * as userCommands from './api/commands/user.commands';
import * as categoryCommands from './api/commands/category.commands';
import * as supplierCommands from './api/commands/supplier.commands';
import * as customerCommands from './api/commands/customer.commands';
import * as productCommands from './api/commands/product.commands';
import * as purchaseCommands from './api/commands/purchase.commands';
import * as saleCommands from './api/commands/sale.commands';

/**
 * Registry of all available Tauri commands
 */
export const commands = {
  ...userCommands,
  ...categoryCommands,
  ...supplierCommands,
  ...customerCommands,
  ...productCommands,
  ...purchaseCommands,
  ...saleCommands,
};

/**
 * Register commands with the Tauri backend
 * This function should be called by the Node.js runtime when starting the backend
 */
export function registerCommands(): Record<string, (...args: any[]) => Promise<any>> {
  return commands;
}

export default commands;
