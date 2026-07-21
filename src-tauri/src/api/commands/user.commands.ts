import { invoke } from '@tauri-apps/api/tauri';
import { UserService } from '@application/services/user.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { RoleRepository } from '@infrastructure/repositories/role.repository';
import { PermissionRepository } from '@infrastructure/repositories/permission.repository';
import {
  UserDTO,
  UserCreateDTO,
  UserUpdateDTO,
  UserChangePasswordDTO,
  LoginDTO,
  LoginResponseDTO,
  RoleDTO,
  RoleCreateDTO,
  RoleUpdateDTO,
  PermissionDTO,
  PermissionCreateDTO,
  PermissionUpdateDTO,
} from '@application/dtos/user.dto';

/**
 * Initialize repositories and service
 */
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const userService = new UserService(
  userRepository,
  roleRepository,
  permissionRepository
);

/**
 * Tauri commands for User operations
 * These commands are exposed to the frontend
 */

// ============================================
// USER COMMANDS
// ============================================

/**
 * Get all users
 */
export async function getUsers(filters?: {
  active?: boolean;
  roleId?: string;
}): Promise<UserDTO[]> {
  try {
    return await userService.getUsers(filters);
  } catch (error) {
    console.error('Error in getUsers command:', error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<UserDTO> {
  try {
    return await userService.getUserById(id);
  } catch (error) {
    console.error('Error in getUserById command:', error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(data: UserCreateDTO): Promise<UserDTO> {
  try {
    return await userService.createUser(data);
  } catch (error) {
    console.error('Error in createUser command:', error);
    throw error;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(data: UserUpdateDTO): Promise<UserDTO> {
  try {
    return await userService.updateUser(data);
  } catch (error) {
    console.error('Error in updateUser command:', error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await userService.deleteUser(id);
  } catch (error) {
    console.error('Error in deleteUser command:', error);
    throw error;
  }
}

/**
 * Change user password
 */
export async function changePassword(data: UserChangePasswordDTO): Promise<void> {
  try {
    await userService.changePassword(data);
  } catch (error) {
    console.error('Error in changePassword command:', error);
    throw error;
  }
}

/**
 * Login user
 */
export async function login(data: LoginDTO): Promise<LoginResponseDTO> {
  try {
    return await userService.login(data);
  } catch (error) {
    console.error('Error in login command:', error);
    throw error;
  }
}

// ============================================
// ROLE COMMANDS
// ============================================

/**
 * Get all roles
 */
export async function getRoles(): Promise<RoleDTO[]> {
  try {
    return await userService.getRoles();
  } catch (error) {
    console.error('Error in getRoles command:', error);
    throw error;
  }
}

/**
 * Get role by ID
 */
export async function getRoleById(id: string): Promise<RoleDTO> {
  try {
    return await userService.getRoleById(id);
  } catch (error) {
    console.error('Error in getRoleById command:', error);
    throw error;
  }
}

/**
 * Create a new role
 */
export async function createRole(data: RoleCreateDTO): Promise<RoleDTO> {
  try {
    return await userService.createRole(data);
  } catch (error) {
    console.error('Error in createRole command:', error);
    throw error;
  }
}

/**
 * Update an existing role
 */
export async function updateRole(data: RoleUpdateDTO): Promise<RoleDTO> {
  try {
    return await userService.updateRole(data);
  } catch (error) {
    console.error('Error in updateRole command:', error);
    throw error;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<void> {
  try {
    await userService.deleteRole(id);
  } catch (error) {
    console.error('Error in deleteRole command:', error);
    throw error;
  }
}

// ============================================
// PERMISSION COMMANDS
// ============================================

/**
 * Get all permissions
 */
export async function getPermissions(): Promise<PermissionDTO[]> {
  try {
    return await userService.getPermissions();
  } catch (error) {
    console.error('Error in getPermissions command:', error);
    throw error;
  }
}

/**
 * Get permission by ID
 */
export async function getPermissionById(id: string): Promise<PermissionDTO> {
  try {
    return await userService.getPermissionById(id);
  } catch (error) {
    console.error('Error in getPermissionById command:', error);
    throw error;
  }
}

/**
 * Create a new permission
 */
export async function createPermission(data: PermissionCreateDTO): Promise<PermissionDTO> {
  try {
    return await userService.createPermission(data);
  } catch (error) {
    console.error('Error in createPermission command:', error);
    throw error;
  }
}

/**
 * Update an existing permission
 */
export async function updatePermission(data: PermissionUpdateDTO): Promise<PermissionDTO> {
  try {
    return await userService.updatePermission(data);
  } catch (error) {
    console.error('Error in updatePermission command:', error);
    throw error;
  }
}

/**
 * Delete a permission
 */
export async function deletePermission(id: string): Promise<void> {
  try {
    await userService.deletePermission(id);
  } catch (error) {
    console.error('Error in deletePermission command:', error);
    throw error;
  }
}
