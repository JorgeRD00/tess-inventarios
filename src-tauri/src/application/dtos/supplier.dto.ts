/**
 * Data Transfer Objects for Supplier
 */

export interface SupplierDTO {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateDTO {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface SupplierUpdateDTO {
  id: string;
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  active?: boolean;
}
