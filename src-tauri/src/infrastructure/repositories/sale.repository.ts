import { Sale as SaleModel, Prisma, User as UserModel, Customer as CustomerModel } from '@prisma/client';
import { Sale } from '@domain/entities/sale.entity';
import { SaleItem } from '@domain/entities/sale-item.entity';
import { ISaleRepository } from '@domain/repositories/sale.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Sale repository
 */
export class SaleRepository implements ISaleRepository {
  async findById(id: string): Promise<Sale | null> {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        customer: true,
      },
    });

    if (!sale) return null;

    return this.mapToEntity(sale);
  }

  async findByFolio(folio: string): Promise<Sale | null> {
    const sale = await prisma.sale.findUnique({
      where: { folio },
      include: {
        items: true,
        user: true,
        customer: true,
      },
    });

    if (!sale) return null;

    return this.mapToEntity(sale);
  }

  async findAll(filters?: {
    customerId?: string;
    paymentMethodId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Sale[]> {
    const where: Prisma.SaleWhereInput = {};

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.paymentMethodId) {
      where.paymentMethodId = filters.paymentMethodId;
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

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: true,
        user: true,
        customer: true,
      },
      orderBy: { date: 'desc' },
    });

    return sales.map(sale => this.mapToEntity(sale));
  }

  async create(sale: Sale): Promise<Sale> {
    const data: Prisma.SaleCreateInput = {
      id: sale.id,
      folio: sale.folio,
      date: sale.date,
      subtotal: sale.subtotal,
      discount: sale.discount,
      tax: sale.tax,
      total: sale.total,
      observations: sale.observations,
      paymentMethod: { connect: { id: sale.paymentMethodId } },
      user: { connect: { id: sale.userId } },
      items: {
        create: sale.items.map(item => ({
          id: item.id,
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          subtotal: item.subtotal,
        })),
      },
    };

    if (sale.customerId) {
      (data as any).customer = { connect: { id: sale.customerId } };
    }

    const created = await prisma.sale.create({
      data,
      include: {
        items: true,
      },
    });

    return this.mapToEntity(created);
  }

  async update(sale: Sale): Promise<Sale> {
    // Delete existing items and recreate them
    await prisma.saleItem.deleteMany({
      where: { saleId: sale.id },
    });

    const data: Prisma.SaleUpdateInput = {
      folio: sale.folio,
      date: sale.date,
      subtotal: sale.subtotal,
      discount: sale.discount,
      tax: sale.tax,
      total: sale.total,
      observations: sale.observations,
      updatedAt: new Date(),
      paymentMethod: { connect: { id: sale.paymentMethodId } },
      user: { connect: { id: sale.userId } },
      items: {
        create: sale.items.map(item => ({
          id: item.id,
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          subtotal: item.subtotal,
        })),
      },
    };

    if (sale.customerId) {
      (data as any).customer = { connect: { id: sale.customerId } };
    } else {
      (data as any).customer = { disconnect: true };
    }

    const updated = await prisma.sale.update({
      where: { id: sale.id },
      data,
      include: {
        items: true,
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.sale.delete({
      where: { id },
    });
  }

  async existsByFolio(folio: string): Promise<boolean> {
    const sale = await prisma.sale.findUnique({
      where: { folio },
      select: { id: true },
    });

    return !!sale;
  }

  async count(filters?: {
    customerId?: string;
  }): Promise<number> {
    return await prisma.sale.count({ where: filters });
  }

  private mapToEntity(model: SaleModel & {
    items?: any[];
    user?: UserModel | null;
    customer?: CustomerModel | null;
  }): Sale {
    return new Sale({
      id: model.id,
      folio: model.folio,
      customerId: model.customerId,
      date: model.date,
      subtotal: Number(model.subtotal),
      discount: Number(model.discount),
      tax: Number(model.tax),
      total: Number(model.total),
      paymentMethodId: model.paymentMethodId,
      observations: model.observations,
      userId: model.userId,
      user: model.user ? { id: model.user.id, name: model.user.name } : undefined,
      customer: model.customer ? { id: model.customer.id, name: model.customer.name } : undefined,
      items: (model.items || []).map(item => new SaleItem({
        id: item.id,
        saleId: item.saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        subtotal: Number(item.subtotal),
      })),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
