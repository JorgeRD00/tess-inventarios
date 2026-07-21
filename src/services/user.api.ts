import ApiService from './api.service';
import type {
  User,
  UserCreate,
  UserUpdate,
  UserChangePassword,
  Login,
  LoginResponse,
  Role,
  RoleCreate,
  RoleUpdate,
  Permission,
  PermissionCreate,
  PermissionUpdate,
} from '../types/user.types';

/**
 * API service for User operations
 * Communicates with Tauri commands
 */
export class UserApiService {
  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Get all users
   */
  static async getUsers(filters?: {
    active?: boolean;
    roleId?: string;
  }): Promise<User[]> {
    return ApiService.invoke<User[]>('get_users', { filters });
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    return ApiService.invoke<User>('get_user_by_id', { id });
  }

  /**
   * Create a new user
   */
  static async createUser(data: UserCreate): Promise<User> {
    return ApiService.invoke<User>('create_user', { data });
  }

  /**
   * Update an existing user
   */
  static async updateUser(data: UserUpdate): Promise<User> {
    return ApiService.invoke<User>('update_user', { data });
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_user', { id });
  }

  /**
   * Change user password
   */
  static async changePassword(data: UserChangePassword): Promise<void> {
    return ApiService.invoke<void>('change_password', { data });
  }

  /**
   * Login user
   */
  static async login(data: Login): Promise<LoginResponse> {
    return ApiService.invoke<LoginResponse>('login', { data });
  }

  // ============================================
  // ROLE OPERATIONS
  // ============================================

  /**
   * Get all roles
   */
  static async getRoles(): Promise<Role[]> {
    return ApiService.invoke<Role[]>('get_roles');
  }

  /**
   * Get role by ID
   */
  static async getRoleById(id: string): Promise<Role> {
    return ApiService.invoke<Role>('get_role_by_id', { id });
  }

  /**
   * Create a new role
   */
  static async createRole(data: RoleCreate): Promise<Role> {
    return ApiService.invoke<Role>('create_role', { data });
  }

  /**
   * Update an existing role
   */
  static async updateRole(data: RoleUpdate): Promise<Role> {
    return ApiService.invoke<Role>('update_role', { data });
  }

  /**
   * Delete a role
   */
  static async deleteRole(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_role', { id });
  }

  // ============================================
  // PERMISSION OPERATIONS
  // ============================================

  /**
   * Get all permissions
   */
  static async getPermissions(): Promise<Permission[]> {
    return ApiService.invoke<Permission[]>('get_permissions');
  }

  /**
   * Get permission by ID
   */
  static async getPermissionById(id: string): Promise<Permission> {
    return ApiService.invoke<Permission>('get_permission_by_id', { id });
  }

  /**
   * Create a new permission
   */
  static async createPermission(data: PermissionCreate): Promise<Permission> {
    return ApiService.invoke<Permission>('create_permission', { data });
  }

  /**
   * Update an existing permission
   */
  static async updatePermission(data: PermissionUpdate): Promise<Permission> {
    return ApiService.invoke<Permission>('update_permission', { data });
  }

  /**
   * Delete a permission
   */
  static async deletePermission(id: string): Promise<void> {
    return ApiService.invoke<void>('delete_permission', { id });
  }
}

export default UserApiService;
