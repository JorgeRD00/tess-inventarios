import { Permission as PermissionModel } from '@prisma/client';
import { Permission } from '@domain/entities/permission.entity';
import { IPermissionRepository } from '@domain/repositories/permission.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Permission repository
 */
export class PermissionRepository implements IPermissionRepository {
  async findById(id: string): Promise<Permission | null> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) return null;

    return this.mapToEntity(permission);
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await prisma.permission.findUnique({
      where: { name },
    });

    if (!permission) return null;

    return this.mapToEntity(permission);
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return permissions.map(p => this.mapToEntity(p));
  }

  async create(permission: Permission): Promise<Permission> {
    const created = await prisma.permission.create({
      data: {
        id: permission.id,
        name: permission.name,
        description: permission.description,
      },
    });

    return this.mapToEntity(created);
  }

  async update(permission: Permission): Promise<Permission> {
    const updated = await prisma.permission.update({
      where: { id: permission.id },
      data: {
        name: permission.name,
        description: permission.description,
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.permission.delete({
      where: { id },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const permission = await prisma.permission.findUnique({
      where: { name },
      select: { id: true },
    });

    return !!permission;
  }

  private mapToEntity(model: PermissionModel): Permission {
    return new Permission({
      id: model.id,
      name: model.name,
      description: model.description,
      createdAt: model.createdAt,
    });
  }
}
