/**
 * Purchase types for frontend
 */

import type { Product } from './product.types';

export interface PurchaseItem {
  id: string
  purchaseId: string
  productId: string
  product?: Product
  quantity: number
  unitCost: number
  subtotal: number
}

export interface PurchaseItemCreate {
  productId: string
  quantity: number
  unitCost: number
}

export interface Purchase {
  id: string
  folio: string
  supplierId: string
  supplier?: { id: string; name: string }
  date: string
  subtotal: number
  tax: number
  total: number
  observations: string | null
  userId: string
  user?: { id: string; name: string }
  items: PurchaseItem[]
  createdAt: string
  updatedAt: string
}

export interface PurchaseCreate {
  folio: string
  supplierId: string
  observations?: string
  userId: string
  items: PurchaseItemCreate[]
}

export interface PurchaseUpdate {
  id: string
  folio?: string
  supplierId?: string
  date?: string
  observations?: string
  userId?: string
  items?: PurchaseItemCreate[]
}
