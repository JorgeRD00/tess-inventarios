/**
 * Data Transfer Objects for User
 * Used for data transfer between layers
 */

export interface UserDTO {
  id: string;
  username: string;
  email: string | null;
  name: string;
  roleId: string;
  roleName?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateDTO {
  username: string;
  email?: string;
  password: string;
  name: string;
  roleId: string;
}

export interface UserUpdateDTO {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  roleId?: string;
  active?: boolean;
}

export interface UserChangePasswordDTO {
  id: string;
  newPassword: string;
  currentPassword?: string;
  requesterId: string;
  requesterRole?: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserDTO;
  token?: string; // For future JWT implementation
}

export interface RoleDTO {
  id: string;
  name: string;
  description: string | null;
  permissions: PermissionDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleCreateDTO {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface RoleUpdateDTO {
  id: string;
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface PermissionDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface PermissionCreateDTO {
  name: string;
  description?: string;
}

export interface PermissionUpdateDTO {
  id: string;
  name?: string;
  description?: string;
}
