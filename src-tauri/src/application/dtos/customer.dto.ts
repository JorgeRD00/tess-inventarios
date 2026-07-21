/**
 * Data Transfer Objects for Customer
 */

export interface CustomerDTO {
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

export interface CustomerCreateDTO {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface CustomerUpdateDTO {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  active?: boolean;
}
