/**
 * User types for frontend
 */

export interface User {
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

export interface UserCreate {
  username: string;
  email?: string;
  password: string;
  name: string;
  roleId: string;
}

export interface UserUpdate {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  roleId?: string;
  active?: boolean;
}

export interface UserChangePassword {
  id: string;
  newPassword: string;
  currentPassword?: string;
  requesterId?: string;
  requesterRole?: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface RoleUpdate {
  id: string;
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface PermissionCreate {
  name: string;
  description?: string;
}

export interface PermissionUpdate {
  id: string;
  name?: string;
  description?: string;
}
