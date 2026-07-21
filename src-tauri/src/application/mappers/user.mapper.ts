import { User } from '@domain/entities/user.entity';
import { Role } from '@domain/entities/role.entity';
import { Permission } from '@domain/entities/permission.entity';
import { UserDTO, RoleDTO, PermissionDTO } from '../dtos/user.dto';

/**
 * Mapper for User entity
 * Converts between domain entities and DTOs
 */
export class UserMapper {
  /**
   * Convert User entity to UserDTO
   */
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      roleName: user.role?.name,
      active: user.active,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of User entities to array of UserDTOs
   */
  static toDTOArray(users: User[]): UserDTO[] {
    return users.map(user => this.toDTO(user));
  }
}

/**
 * Mapper for Role entity
 */
export class RoleMapper {
  /**
   * Convert Role entity to RoleDTO
   */
  static toDTO(role: Role): RoleDTO {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(p => PermissionMapper.toDTO(p)),
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    };
  }

  /**
   * Convert array of Role entities to array of RoleDTOs
   */
  static toDTOArray(roles: Role[]): RoleDTO[] {
    return roles.map(role => this.toDTO(role));
  }
}

/**
 * Mapper for Permission entity
 */
export class PermissionMapper {
  /**
   * Convert Permission entity to PermissionDTO
   */
  static toDTO(permission: Permission): PermissionDTO {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt.toISOString(),
    };
  }

  /**
   * Convert array of Permission entities to array of PermissionDTOs
   */
  static toDTOArray(permissions: Permission[]): PermissionDTO[] {
    return permissions.map(p => this.toDTO(p));
  }
}
