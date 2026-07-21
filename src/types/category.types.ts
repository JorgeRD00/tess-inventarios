/**
 * Category and Brand types for frontend
 */

export interface Category {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
}

export interface CategoryUpdate {
  id: string;
  name?: string;
  description?: string;
  active?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandCreate {
  name: string;
  description?: string;
  website?: string;
}

export interface BrandUpdate {
  id: string;
  name?: string;
  description?: string;
  website?: string;
  active?: boolean;
}
