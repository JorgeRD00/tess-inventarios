import { Brand as BrandModel } from '@prisma/client';
import { Brand } from '@domain/entities/brand.entity';
import { IBrandRepository } from '@domain/repositories/brand.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Brand repository
 */
export class BrandRepository implements IBrandRepository {
  async findById(id: string): Promise<Brand | null> {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) return null;

    return this.mapToEntity(brand);
  }

  async findByName(name: string): Promise<Brand | null> {
    const brand = await prisma.brand.findUnique({
      where: { name },
    });

    if (!brand) return null;

    return this.mapToEntity(brand);
  }

  async findAll(filters?: {
    active?: boolean;
  }): Promise<Brand[]> {
    const brands = await prisma.brand.findMany({
      where: filters,
      orderBy: {
        name: 'asc',
      },
    });

    return brands.map(brand => this.mapToEntity(brand));
  }

  async create(brand: Brand): Promise<Brand> {
    const created = await prisma.brand.create({
      data: {
        id: brand.id,
        name: brand.name,
        description: brand.description,
        website: brand.website,
        active: brand.active,
      },
    });

    return this.mapToEntity(created);
  }

  async update(brand: Brand): Promise<Brand> {
    const updated = await prisma.brand.update({
      where: { id: brand.id },
      data: {
        name: brand.name,
        description: brand.description,
        website: brand.website,
        active: brand.active,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.brand.delete({
      where: { id },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const brand = await prisma.brand.findUnique({
      where: { name },
      select: { id: true },
    });

    return !!brand;
  }

  async count(filters?: {
    active?: boolean;
  }): Promise<number> {
    return await prisma.brand.count({ where: filters });
  }

  private mapToEntity(model: BrandModel): Brand {
    return new Brand({
      id: model.id,
      name: model.name,
      description: model.description,
      website: model.website,
      active: model.active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
