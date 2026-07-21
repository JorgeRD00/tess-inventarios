/**
 * Sale types for frontend
 */

import type { Product } from './product.types';

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

export interface SaleItemCreate {
  productId: string
  quantity: number
  unitPrice: number
  discount?: number
}

export interface Sale {
  id: string
  folio: string
  customerId: string | null
  customer?: { id: string; name: string }
  date: string
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethodId: string
  observations: string | null
  userId: string
  user?: { id: string; name: string }
  items: SaleItem[]
  createdAt: string
  updatedAt: string
}

export interface SaleCreate {
  folio: string
  customerId?: string
  paymentMethodId: string
  observations?: string
  userId: string
  discount?: number
  items: SaleItemCreate[]
}

export interface SaleUpdate {
  id: string
  folio?: string
  customerId?: string
  date?: string
  paymentMethodId?: string
  observations?: string
  userId?: string
  discount?: number
  items?: SaleItemCreate[]
}
