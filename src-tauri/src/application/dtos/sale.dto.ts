/**
 * Data Transfer Objects for Sale
 */

export interface SaleItemDTO {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface SaleItemCreateDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface SaleDTO {
  id: string;
  folio: string;
  customerId: string | null;
  customer?: { id: string; name: string };
  date: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethodId: string;
  observations: string | null;
  userId: string;
  user?: { id: string; name: string };
  items: SaleItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleCreateDTO {
  folio: string;
  customerId?: string;
  paymentMethodId: string;
  observations?: string;
  userId: string;
  discount?: number;
  items: SaleItemCreateDTO[];
}

export interface SaleUpdateDTO {
  id: string;
  folio?: string;
  customerId?: string;
  date?: string;
  paymentMethodId?: string;
  observations?: string;
  userId?: string;
  discount?: number;
  items?: SaleItemCreateDTO[];
}
