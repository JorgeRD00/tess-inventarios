import { User as UserModel, Role as RoleModel, Permission as PermissionModel, RolePermission as RolePermissionModel } from '@prisma/client';
import { User } from '@domain/entities/user.entity';
import { Role } from '@domain/entities/role.entity';
import { Permission } from '@domain/entities/permission.entity';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of User repository
 * Handles data access operations for users using Prisma ORM
 */
export class UserRepository implements IUserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  /**
   * Find all users with optional filters
   */
  async findAll(filters?: {
    active?: boolean;
    roleId?: string;
  }): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: filters,
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(user => this.mapToEntity(user));
  }

  /**
   * Create a new user
   */
  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        roleId: user.roleId,
        active: user.active,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return this.mapToEntity(created);
  }

  /**
   * Update an existing user
   */
  async update(user: User): Promise<User> {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        roleId: user.roleId,
        active: user.active,
        updatedAt: new Date(),
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Count users with optional filters
   */
  async count(filters?: {
    active?: boolean;
    roleId?: string;
  }): Promise<number> {
    return await prisma.user.count({ where: filters });
  }

  /**
   * Check if username exists
   */
  async existsByUsername(username: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    return !!user;
  }

  /**
   * Check if email exists
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  /**
   * Map Prisma model to domain entity
   */
  private mapToEntity(model: UserModel & {
    role: RoleModel & {
      permissions: (RolePermissionModel & { permission: PermissionModel | null })[];
    };
  }): User {
    const role = this.mapRoleToEntity(model.role);

    return new User({
      id: model.id,
      username: model.username,
      email: model.email,
      passwordHash: model.passwordHash,
      name: model.name,
      roleId: model.roleId,
      role,
      active: model.active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  /**
   * Map Prisma role model to domain entity
   */
  private mapRoleToEntity(model: RoleModel & {
    permissions: (RolePermissionModel & { permission: PermissionModel | null })[];
  }): Role {
    const permissions = model.permissions
      .filter((p): p is RolePermissionModel & { permission: PermissionModel } => p.permission !== null)
      .map(p =>
        new Permission({
          id: p.permission.id,
          name: p.permission.name,
          description: p.permission.description,
          createdAt: p.permission.createdAt,
        })
      );

    return new Role({
      id: model.id,
      name: model.name,
      description: model.description,
      permissions,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
