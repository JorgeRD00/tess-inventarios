import { Purchase as PurchaseModel, Prisma, User as UserModel, Supplier as SupplierModel } from '@prisma/client';
import { Purchase } from '@domain/entities/purchase.entity';
import { PurchaseItem } from '@domain/entities/purchase-item.entity';
import { IPurchaseRepository } from '@domain/repositories/purchase.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Purchase repository
 */
export class PurchaseRepository implements IPurchaseRepository {
  async findById(id: string): Promise<Purchase | null> {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        supplier: true,
      },
    });

    if (!purchase) return null;

    return this.mapToEntity(purchase);
  }

  async findByFolio(folio: string): Promise<Purchase | null> {
    const purchase = await prisma.purchase.findUnique({
      where: { folio },
      include: {
        items: true,
        user: true,
        supplier: true,
      },
    });

    if (!purchase) return null;

    return this.mapToEntity(purchase);
  }

  async findAll(filters?: {
    supplierId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Purchase[]> {
    const where: Prisma.PurchaseWhereInput = {};

    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        items: true,
        user: true,
        supplier: true,
      },
      orderBy: { date: 'desc' },
    });

    return purchases.map(purchase => this.mapToEntity(purchase));
  }

  async create(purchase: Purchase): Promise<Purchase> {
    const created = await prisma.purchase.create({
      data: {
        id: purchase.id,
        folio: purchase.folio,
        supplier: { connect: { id: purchase.supplierId } },
        date: purchase.date,
        subtotal: purchase.subtotal,
        tax: purchase.tax,
        total: purchase.total,
        observations: purchase.observations,
        user: { connect: { id: purchase.userId } },
        items: {
          create: purchase.items.map(item => ({
            id: item.id,
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapToEntity(created);
  }

  async update(purchase: Purchase): Promise<Purchase> {
    // Delete existing items and recreate them
    await prisma.purchaseItem.deleteMany({
      where: { purchaseId: purchase.id },
    });

    const updated = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        folio: purchase.folio,
        supplier: { connect: { id: purchase.supplierId } },
        date: purchase.date,
        subtotal: purchase.subtotal,
        tax: purchase.tax,
        total: purchase.total,
        observations: purchase.observations,
        user: { connect: { id: purchase.userId } },
        updatedAt: new Date(),
        items: {
          create: purchase.items.map(item => ({
            id: item.id,
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.purchase.delete({
      where: { id },
    });
  }

  async existsByFolio(folio: string): Promise<boolean> {
    const purchase = await prisma.purchase.findUnique({
      where: { folio },
      select: { id: true },
    });

    return !!purchase;
  }

  async count(filters?: {
    supplierId?: string;
  }): Promise<number> {
    return await prisma.purchase.count({ where: filters });
  }

  private mapToEntity(model: PurchaseModel & {
    items?: any[];
    user?: UserModel | null;
    supplier?: SupplierModel | null;
  }): Purchase {
    return new Purchase({
      id: model.id,
      folio: model.folio,
      supplierId: model.supplierId,
      date: model.date,
      subtotal: Number(model.subtotal),
      tax: Number(model.tax),
      total: Number(model.total),
      observations: model.observations,
      userId: model.userId,
      user: model.user ? { id: model.user.id, name: model.user.name } : undefined,
      supplier: model.supplier ? { id: model.supplier.id, name: model.supplier.name } : undefined,
      items: (model.items || []).map(item => new PurchaseItem({
        id: item.id,
        purchaseId: item.purchaseId,
        productId: item.productId,
        quantity: item.quantity,
        unitCost: Number(item.unitCost),
        subtotal: Number(item.subtotal),
      })),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
