import { Category as CategoryModel } from '@prisma/client';
import { Category } from '@domain/entities/category.entity';
import { ICategoryRepository } from '@domain/repositories/category.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Category repository
 */
export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return this.mapToEntity(category);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { name },
    });

    if (!category) return null;

    return this.mapToEntity(category);
  }

  async findAll(filters?: {
    active?: boolean;
  }): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: filters,
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map(category => this.mapToEntity(category));
  }

  async create(category: Category): Promise<Category> {
    const created = await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        active: category.active,
      },
    });

    return this.mapToEntity(created);
  }

  async update(category: Category): Promise<Category> {
    const updated = await prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        description: category.description,
        active: category.active,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: { name },
      select: { id: true },
    });

    return !!category;
  }

  async count(filters?: {
    active?: boolean;
  }): Promise<number> {
    return await prisma.category.count({ where: filters });
  }

  private mapToEntity(model: CategoryModel): Category {
    return new Category({
      id: model.id,
      name: model.name,
      description: model.description,
      active: model.active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
