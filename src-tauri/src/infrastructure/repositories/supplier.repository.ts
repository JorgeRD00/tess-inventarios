import { Supplier as SupplierModel } from '@prisma/client';
import { Supplier } from '@domain/entities/supplier.entity';
import { ISupplierRepository } from '@domain/repositories/supplier.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Supplier repository
 */
export class SupplierRepository implements ISupplierRepository {
  async findById(id: string): Promise<Supplier | null> {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) return null;

    return this.mapToEntity(supplier);
  }

  async findByName(name: string): Promise<Supplier | null> {
    const supplier = await prisma.supplier.findFirst({
      where: {
        name: { equals: name },
      },
    });

    if (!supplier) return null;

    return this.mapToEntity(supplier);
  }

  async findByTaxId(taxId: string): Promise<Supplier | null> {
    const supplier = await prisma.supplier.findUnique({
      where: { taxId },
    });

    if (!supplier) return null;

    return this.mapToEntity(supplier);
  }

  async findAll(filters?: {
    active?: boolean;
  }): Promise<Supplier[]> {
    const suppliers = await prisma.supplier.findMany({
      where: filters,
      orderBy: {
        name: 'asc',
      },
    });

    return suppliers.map(supplier => this.mapToEntity(supplier));
  }

  async search(query: string): Promise<Supplier[]> {
    const suppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { contactName: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });

    return suppliers.map(supplier => this.mapToEntity(supplier));
  }

  async create(supplier: Supplier): Promise<Supplier> {
    const created = await prisma.supplier.create({
      data: {
        id: supplier.id,
        name: supplier.name,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        taxId: supplier.taxId,
        active: supplier.active,
      },
    });

    return this.mapToEntity(created);
  }

  async update(supplier: Supplier): Promise<Supplier> {
    const updated = await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        name: supplier.name,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        taxId: supplier.taxId,
        active: supplier.active,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.delete({
      where: { id },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const supplier = await prisma.supplier.findFirst({
      where: {
        name: { equals: name },
      },
      select: { id: true },
    });

    return !!supplier;
  }

  async existsByTaxId(taxId: string): Promise<boolean> {
    const supplier = await prisma.supplier.findUnique({
      where: { taxId },
      select: { id: true },
    });

    return !!supplier;
  }

  async count(filters?: {
    active?: boolean;
  }): Promise<number> {
    return await prisma.supplier.count({ where: filters });
  }

  private mapToEntity(model: SupplierModel): Supplier {
    return new Supplier({
      id: model.id,
      name: model.name,
      contactName: model.contactName,
      email: model.email,
      phone: model.phone,
      address: model.address,
      taxId: model.taxId,
      active: model.active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
