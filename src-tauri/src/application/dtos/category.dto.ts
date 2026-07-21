/**
 * Data Transfer Objects for Category and Brand
 */

export interface CategoryDTO {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateDTO {
  name: string;
  description?: string;
}

export interface CategoryUpdateDTO {
  id: string;
  name?: string;
  description?: string;
  active?: boolean;
}

export interface BrandDTO {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandCreateDTO {
  name: string;
  description?: string;
  website?: string;
}

export interface BrandUpdateDTO {
  id: string;
  name?: string;
  description?: string;
  website?: string;
  active?: boolean;
}
