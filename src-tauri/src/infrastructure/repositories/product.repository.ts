import { Product as ProductModel, Prisma } from '@prisma/client';
import { Product } from '@domain/entities/product.entity';
import { ProductImage } from '@domain/entities/product-image.entity';
import { MotorcycleCompatibility } from '@domain/entities/motorcycle-compatibility.entity';
import { Brand } from '@domain/entities/brand.entity';
import { Category } from '@domain/entities/category.entity';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Product repository
 */
export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
    });

    if (!product) return null;

    return this.mapToEntity(product);
  }

  async findByInternalCode(internalCode: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { internalCode },
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
    });

    if (!product) return null;

    return this.mapToEntity(product);
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { barcode },
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
    });

    if (!product) return null;

    return this.mapToEntity(product);
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: { name: { equals: name } },
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
    });

    if (!product) return null;

    return this.mapToEntity(product);
  }

  async findAll(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.active !== undefined) {
      where.active = filters.active;
    }
    if (filters?.brandId) {
      where.brandId = filters.brandId;
    }
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }
    if (filters?.lowStock) {
      where.stock = { lte: prisma.product.fields.minStock };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
      orderBy: { name: 'asc' },
    });

    return products.map(product => this.mapToEntity(product));
  }

  async search(query: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { internalCode: { contains: query } },
          { barcode: { contains: query } },
          { sku: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
      orderBy: { name: 'asc' },
    });

    return products.map(product => this.mapToEntity(product));
  }

  async create(product: Product): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        id: product.id,
        internalCode: product.internalCode,
        barcode: product.barcode,
        sku: product.sku,
        name: product.name,
        description: product.description,
        brandId: product.brandId,
        categoryId: product.categoryId,
        unit: product.unit,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        location: product.location,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        supplierId: product.supplierId,
        observations: product.observations,
        active: product.active,
        images: product.images.length > 0 ? {
          createMany: {
            data: product.images.map(img => ({
              id: img.id,
              productId: product.id,
              path: img.path,
              order: img.order,
              createdAt: img.createdAt,
            })),
          },
        } : undefined,
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        compatibilities: true,
        brand: true,
        category: true,
      },
    });

    return this.mapToEntity(created);
  }

  async update(product: Product): Promise<Product> {
    const data: Prisma.ProductUpdateInput = {
      internalCode: product.internalCode,
      barcode: product.barcode,
      sku: product.sku,
      name: product.name,
      description: product.description,
      brand: { connect: { id: product.brandId } },
      category: { connect: { id: product.categoryId } },
      unit: product.unit,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      location: product.location,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      supplier: product.supplierId ? { connect: { id: product.supplierId } } : { disconnect: true },
      observations: product.observations,
      active: product.active,
      updatedAt: new Date(),
    };

    await prisma.product.update({
      where: { id: product.id },
      data,
    });

    // Update images (replace all)
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    if (product.images.length > 0) {
      await prisma.productImage.createMany({
        data: product.images.map(img => ({
          id: img.id,
          productId: product.id,
          path: img.path,
          order: img.order,
          createdAt: img.createdAt,
        })),
      });
    }

    // Update compatibilities
    if (product.compatibilities.length > 0) {
      await prisma.motorcycleCompatibility.deleteMany({
        where: { productId: product.id },
      });

      await prisma.motorcycleCompatibility.createMany({
        data: product.compatibilities.map(c => ({
          id: c.id,
          productId: product.id,
          brand: c.brand,
          model: c.model,
          year: c.year,
          notes: c.notes,
        })),
      });
    }

    return await this.findById(product.id) as Product;
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  async existsByInternalCode(internalCode: string): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { internalCode },
      select: { id: true },
    });
    return !!product;
  }

  async existsByBarcode(barcode: string): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { barcode },
      select: { id: true },
    });
    return !!product;
  }

  async count(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
  }): Promise<number> {
    return await prisma.product.count({ where: filters });
  }

  private mapToEntity(model: ProductModel & {
    images?: any[];
    compatibilities?: any[];
    brand?: any;
    category?: any;
  }): Product {
    const brand = model.brand
      ? new Brand({
          id: model.brand.id,
          name: model.brand.name,
          description: model.brand.description,
          website: model.brand.website,
          active: model.brand.active,
          createdAt: model.brand.createdAt,
          updatedAt: model.brand.updatedAt,
        })
      : undefined;

    const category = model.category
      ? new Category({
          id: model.category.id,
          name: model.category.name,
          description: model.category.description,
          active: model.category.active,
          createdAt: model.category.createdAt,
          updatedAt: model.category.updatedAt,
        })
      : undefined;

    return new Product({
      id: model.id,
      internalCode: model.internalCode,
      barcode: model.barcode,
      sku: model.sku,
      name: model.name,
      description: model.description,
      brandId: model.brandId,
      categoryId: model.categoryId,
      brand,
      category,
      unit: model.unit,
      stock: model.stock,
      minStock: model.minStock,
      maxStock: model.maxStock,
      location: model.location,
      purchasePrice: Number(model.purchasePrice),
      salePrice: Number(model.salePrice),
      supplierId: model.supplierId,
      observations: model.observations,
      active: model.active,
      images: (model.images || []).map(img => new ProductImage({
        id: img.id,
        productId: img.productId,
        path: img.path,
        order: img.order,
        createdAt: img.createdAt,
      })),
      compatibilities: (model.compatibilities || []).map(c => new MotorcycleCompatibility({
        id: c.id,
        productId: c.productId,
        brand: c.brand,
        model: c.model,
        year: c.year,
        notes: c.notes,
      })),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
