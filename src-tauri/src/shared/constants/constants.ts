/**
 * Movement types
 */
export const MOVEMENT_TYPES = {
  ENTRY: 'ENTRADA',
  EXIT: 'SALIDA',
  ADJUSTMENT: 'AJUSTE',
  TRANSFER: 'TRANSFERENCIA',
} as const;

/**
 * Default movement types with their properties
 */
export const DEFAULT_MOVEMENT_TYPES = [
  {
    name: MOVEMENT_TYPES.ENTRY,
    description: 'Entrada de mercancía (compra, devolución)',
    affectsStock: true,
  },
  {
    name: MOVEMENT_TYPES.EXIT,
    description: 'Salida de mercancía (venta, merma)',
    affectsStock: true,
  },
  {
    name: MOVEMENT_TYPES.ADJUSTMENT,
    description: 'Ajuste de inventario (conteo físico)',
    affectsStock: true,
  },
  {
    name: MOVEMENT_TYPES.TRANSFER,
    description: 'Transferencia entre sucursales',
    affectsStock: false,
  },
] as const;

/**
 * Default roles
 */
export const DEFAULT_ROLES = [
  {
    name: 'ADMINISTRADOR',
    description: 'Acceso total al sistema',
  },
  {
    name: 'EMPLEADO',
    description: 'Acceso limitado a ventas e inventario',
  },
] as const;

/**
 * Default permissions
 */
export const DEFAULT_PERMISSIONS = [
  // Product permissions
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  
  // Inventory permissions
  'inventory.view',
  'inventory.movements',
  'inventory.adjust',
  
  // Purchase permissions
  'purchases.view',
  'purchases.create',
  'purchases.edit',
  'purchases.delete',
  
  // Sale permissions
  'sales.view',
  'sales.create',
  'sales.edit',
  'sales.delete',
  
  // Customer permissions
  'customers.view',
  'customers.create',
  'customers.edit',
  'customers.delete',
  
  // Supplier permissions
  'suppliers.view',
  'suppliers.create',
  'suppliers.edit',
  'suppliers.delete',
  
  // Report permissions
  'reports.view',
  'reports.export',
  
  // User permissions
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  
  // Settings permissions
  'settings.manage',
] as const;

/**
 * Default payment methods
 */
export const DEFAULT_PAYMENT_METHODS = [
  'EFECTIVO',
  'TARJETA_CREDITO',
  'TARJETA_DEBITO',
  'TRANSFERENCIA',
] as const;

/**
 * Common units
 */
export const UNITS = [
  'PIEZA',
  'LITRO',
  'METRO',
  'KILO',
  'CAJA',
  'PAQUETE',
  'JUEGO',
  'CONJUNTO',
] as const;
