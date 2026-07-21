import bcrypt from 'bcrypt';
import { User } from '@domain/entities/user.entity';
import { Role } from '@domain/entities/role.entity';
import { Permission } from '@domain/entities/permission.entity';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IRoleRepository } from '@domain/repositories/role.repository.interface';
import { IPermissionRepository } from '@domain/repositories/permission.repository.interface';
import { AuthService } from '@domain/services/auth.service';
import { UserMapper, RoleMapper, PermissionMapper } from '../mappers/user.mapper';
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
} from '../dtos/user.dto';
import { ValidationError, NotFoundError, ConflictError, BusinessError } from '@shared/errors/custom-error';
import { isValidEmail, isRequired } from '@shared/validators/validators';

/**
 * Application service for User operations
 * Contains use cases and business logic orchestration
 */
export class UserService {
  private authService: AuthService;

  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository
  ) {
    this.authService = new AuthService(userRepository);
  }

  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: {
    active?: boolean;
    roleId?: string;
  }): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll(filters);
    return UserMapper.toDTOArray(users);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new NotFoundError('User', id);
    }

    return UserMapper.toDTO(user);
  }

  /**
   * Create a new user
   */
  async createUser(data: UserCreateDTO): Promise<UserDTO> {
    // Validate input
    this.validateUserCreate(data);

    // Check if username is available
    const usernameAvailable = await this.authService.isUsernameAvailable(data.username);
    if (!usernameAvailable) {
      throw new ConflictError('El usuario ya existe');
    }

    // Check if email is available (if provided)
    if (data.email) {
      const emailAvailable = await this.authService.isEmailAvailable(data.email);
      if (!emailAvailable) {
        throw new ConflictError('El correo ya existe');
      }
    }

    // Verify role exists
    const role = await this.roleRepository.findById(data.roleId);
    if (!role) {
      throw new NotFoundError('Role', data.roleId);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user entity
    const user = User.create({
      username: data.username,
      email: data.email || null,
      passwordHash,
      name: data.name,
      roleId: data.roleId,
    });

    // Save user
    const createdUser = await this.userRepository.create(user);

    return UserMapper.toDTO(createdUser);
  }

  /**
   * Update an existing user
   */
  async updateUser(data: UserUpdateDTO): Promise<UserDTO> {
    // Get existing user
    const user = await this.userRepository.findById(data.id);
    if (!user) {
      throw new NotFoundError('User', data.id);
    }

    // Validate input
    if (data.username !== undefined) {
      if (!isRequired(data.username)) {
        throw new ValidationError('Username is required');
      }
      if (data.username.length < 3) {
        throw new ValidationError('Username must be at least 3 characters');
      }
      
      // Check if username is available
      const usernameAvailable = await this.authService.isUsernameAvailable(
        data.username,
        data.id
      );
      if (!usernameAvailable) {
        throw new ConflictError('El usuario ya existe');
      }
      
      user.updateUsername(data.username);
    }

    if (data.email !== undefined) {
      if (data.email && !isValidEmail(data.email)) {
        throw new ValidationError('Invalid email format');
      }
      
      // Check if email is available
      const emailAvailable = await this.authService.isEmailAvailable(
        data.email || '',
        data.id
      );
      if (!emailAvailable) {
        throw new ConflictError('El correo ya existe');
      }
      
      user.updateEmail(data.email || null);
    }

    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Name is required');
      }
      user.updateName(data.name);
    }

    if (data.roleId !== undefined) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) {
        throw new NotFoundError('Role', data.roleId);
      }
      user.assignRole(data.roleId);
    }

    if (data.active !== undefined) {
      if (data.active) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    // Save user
    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toDTO(updatedUser);
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }

    await this.userRepository.delete(id);
  }

  /**
   * Change user password
   */
  async changePassword(data: UserChangePasswordDTO): Promise<void> {
    const targetUser = await this.userRepository.findById(data.id);
    if (!targetUser) {
      throw new NotFoundError('User', data.id);
    }

    const requester = await this.userRepository.findById(data.requesterId);
    if (!requester) {
      throw new BusinessError('Usuario no autenticado');
    }

    const isRequesterAdmin = requester.role?.name === 'ADMINISTRADOR';
    const isOwnUser = requester.id === targetUser.id;

    if (!isRequesterAdmin && !isOwnUser) {
      throw new BusinessError('No tiene permiso para cambiar esta contraseña');
    }

    // Solo los empleados requieren la contraseña actual para cambiar su propia contraseña
    if (!isRequesterAdmin) {
      if (!data.currentPassword) {
        throw new ValidationError('Debe proporcionar la contraseña actual');
      }
      const passwordMatch = await bcrypt.compare(data.currentPassword, targetUser.passwordHash);
      if (!passwordMatch) {
        throw new ValidationError('La contraseña actual es incorrecta');
      }
    }

    // Validate new password
    if (data.newPassword.length < 8) {
      throw new ValidationError('La nueva contraseña debe tener al menos 8 caracteres');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    // Update password
    targetUser.updatePassword(passwordHash);
    await this.userRepository.update(targetUser);
  }

  /**
   * Login user
   */
  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.authService.authenticate(data.username, data.password);

    // Verify password
    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) {
      throw new BusinessError('Usuario o contraseña incorrectos');
    }

    return {
      user: UserMapper.toDTO(user),
      // Token will be added when JWT is implemented
    };
  }

  // ============================================
  // ROLE OPERATIONS
  // ============================================

  /**
   * Get all roles
   */
  async getRoles(): Promise<RoleDTO[]> {
    const roles = await this.roleRepository.findAll();
    return RoleMapper.toDTOArray(roles);
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<RoleDTO> {
    const role = await this.roleRepository.findById(id);
    
    if (!role) {
      throw new NotFoundError('Role', id);
    }

    return RoleMapper.toDTO(role);
  }

  /**
   * Create a new role
   */
  async createRole(data: RoleCreateDTO): Promise<RoleDTO> {
    // Validate input
    if (!isRequired(data.name)) {
      throw new ValidationError('Role name is required');
    }

    // Check if role name is available
    const nameAvailable = await this.roleRepository.existsByName(data.name);
    if (nameAvailable) {
      throw new ConflictError('El nombre del rol ya existe');
    }

    // Create role entity
    const role = Role.create({
      name: data.name,
      description: data.description,
    });

    // Add permissions if provided
    if (data.permissionIds && data.permissionIds.length > 0) {
      for (const permissionId of data.permissionIds) {
        const permission = await this.permissionRepository.findById(permissionId);
        if (permission) {
          role.addPermission(permission);
        }
      }
    }

    // Save role
    const createdRole = await this.roleRepository.create(role);

    return RoleMapper.toDTO(createdRole);
  }

  /**
   * Update an existing role
   */
  async updateRole(data: RoleUpdateDTO): Promise<RoleDTO> {
    const role = await this.roleRepository.findById(data.id);
    if (!role) {
      throw new NotFoundError('Role', data.id);
    }

    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Role name is required');
      }
      
      // Check if name is available
      const nameAvailable = await this.roleRepository.existsByName(data.name);
      if (nameAvailable && data.name !== role.name) {
        throw new ConflictError('El nombre del rol ya existe');
      }
      
      role.updateName(data.name);
    }

    if (data.description !== undefined) {
      role.updateDescription(data.description);
    }

    // Update permissions if provided
    if (data.permissionIds !== undefined) {
      // Remove all existing permissions
      const currentPermissions = role.permissions;
      currentPermissions.forEach(p => role.removePermission(p.id));

      // Add new permissions
      for (const permissionId of data.permissionIds) {
        const permission = await this.permissionRepository.findById(permissionId);
        if (permission) {
          role.addPermission(permission);
        }
      }
    }

    // Save role
    const updatedRole = await this.roleRepository.update(role);

    return RoleMapper.toDTO(updatedRole);
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError('Role', id);
    }

    // Check if role is being used by users
    const usersWithRole = await this.userRepository.findAll({ roleId: id });
    if (usersWithRole.length > 0) {
      throw new BusinessError('Cannot delete role that is assigned to users');
    }

    await this.roleRepository.delete(id);
  }

  // ============================================
  // PERMISSION OPERATIONS
  // ============================================

  /**
   * Get all permissions
   */
  async getPermissions(): Promise<PermissionDTO[]> {
    const permissions = await this.permissionRepository.findAll();
    return PermissionMapper.toDTOArray(permissions);
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id: string): Promise<PermissionDTO> {
    const permission = await this.permissionRepository.findById(id);
    
    if (!permission) {
      throw new NotFoundError('Permission', id);
    }

    return PermissionMapper.toDTO(permission);
  }

  /**
   * Create a new permission
   */
  async createPermission(data: PermissionCreateDTO): Promise<PermissionDTO> {
    // Validate input
    if (!isRequired(data.name)) {
      throw new ValidationError('Permission name is required');
    }

    // Check if permission name is available
    const nameAvailable = await this.permissionRepository.existsByName(data.name);
    if (nameAvailable) {
      throw new ConflictError('El nombre del permiso ya existe');
    }

    // Create permission entity
    const permission = Permission.create({
      name: data.name,
      description: data.description,
    });

    // Save permission
    const createdPermission = await this.permissionRepository.create(permission);

    return PermissionMapper.toDTO(createdPermission);
  }

  /**
   * Update an existing permission
   */
  async updatePermission(data: PermissionUpdateDTO): Promise<PermissionDTO> {
    const permission = await this.permissionRepository.findById(data.id);
    if (!permission) {
      throw new NotFoundError('Permission', data.id);
    }

    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Permission name is required');
      }
      
      // Check if name is available
      const nameAvailable = await this.permissionRepository.existsByName(data.name);
      if (nameAvailable && data.name !== permission.name) {
        throw new ConflictError('El nombre del permiso ya existe');
      }
      
      permission.updateName(data.name);
    }

    if (data.description !== undefined) {
      permission.updateDescription(data.description);
    }

    // Save permission
    const updatedPermission = await this.permissionRepository.update(permission);

    return PermissionMapper.toDTO(updatedPermission);
  }

  /**
   * Delete a permission
   */
  async deletePermission(id: string): Promise<void> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundError('Permission', id);
    }

    await this.permissionRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validateUserCreate(data: UserCreateDTO): void {
    if (!isRequired(data.username)) {
      throw new ValidationError('El usuario es requerido');
    }
    if (data.username.length < 3) {
      throw new ValidationError('El usuario debe tener al menos 3 caracteres');
    }
    if (!isRequired(data.password)) {
      throw new ValidationError('La contraseña es requerida');
    }
    if (data.password.length < 8) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }
    if (!isRequired(data.name)) {
      throw new ValidationError('El nombre es requerido');
    }
    if (!isRequired(data.roleId)) {
      throw new ValidationError('El rol es requerido');
    }
    if (data.email && !isValidEmail(data.email)) {
      throw new ValidationError('Formato de correo inválido');
    }
  }
}
