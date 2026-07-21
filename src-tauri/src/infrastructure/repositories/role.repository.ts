import { Role as RoleModel, Permission as PermissionModel, RolePermission as RolePermissionModel } from '@prisma/client';
import { Role } from '@domain/entities/role.entity';
import { Permission } from '@domain/entities/permission.entity';
import { IRoleRepository } from '@domain/repositories/role.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Role repository
 */
export class RoleRepository implements IRoleRepository {
  async findById(id: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) return null;

    return this.mapToEntity(role);
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) return null;

    return this.mapToEntity(role);
  }

  async findAll(): Promise<Role[]> {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return roles.map(role => this.mapToEntity(role));
  }

  async create(role: Role): Promise<Role> {
    const created = await prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.mapToEntity(created);
  }

  async update(role: Role): Promise<Role> {
    const updated = await prisma.role.update({
      where: { id: role.id },
      data: {
        name: role.name,
        description: role.description,
        updatedAt: new Date(),
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.role.delete({
      where: { id },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const role = await prisma.role.findUnique({
      where: { name },
      select: { id: true },
    });

    return !!role;
  }

  private mapToEntity(model: RoleModel & {
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
