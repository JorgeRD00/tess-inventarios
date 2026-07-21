/**
 * Customer types for frontend
 */

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreate {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface CustomerUpdate {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  active?: boolean;
}
