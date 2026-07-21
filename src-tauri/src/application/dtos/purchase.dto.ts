/**
 * Data Transfer Objects for Purchase
 */

export interface PurchaseItemDTO {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseItemCreateDTO {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseDTO {
  id: string;
  folio: string;
  supplierId: string;
  supplier?: { id: string; name: string };
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  observations: string | null;
  userId: string;
  user?: { id: string; name: string };
  items: PurchaseItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseCreateDTO {
  folio: string;
  supplierId: string;
  observations?: string;
  userId: string;
  items: PurchaseItemCreateDTO[];
}

export interface PurchaseUpdateDTO {
  id: string;
  folio?: string;
  supplierId?: string;
  date?: string;
  observations?: string;
  userId?: string;
  items?: PurchaseItemCreateDTO[];
}
