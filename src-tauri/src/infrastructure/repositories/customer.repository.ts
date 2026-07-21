import { Customer as CustomerModel } from '@prisma/client';
import { Customer } from '@domain/entities/customer.entity';
import { ICustomerRepository } from '@domain/repositories/customer.repository.interface';
import prisma from '../database/client';

/**
 * Prisma implementation of Customer repository
 */
export class CustomerRepository implements ICustomerRepository {
  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) return null;

    return this.mapToEntity(customer);
  }

  async findByName(name: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: { name },
    });

    if (!customer) return null;

    return this.mapToEntity(customer);
  }

  async findByTaxId(taxId: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { taxId },
    });

    if (!customer) return null;

    return this.mapToEntity(customer);
  }

  async findAll(filters?: {
    active?: boolean;
  }): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      where: filters,
      orderBy: {
        name: 'asc',
      },
    });

    return customers.map(customer => this.mapToEntity(customer));
  }

  async search(query: string): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });

    return customers.map(customer => this.mapToEntity(customer));
  }

  async create(customer: Customer): Promise<Customer> {
    const created = await prisma.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        taxId: customer.taxId,
        active: customer.active,
      },
    });

    return this.mapToEntity(created);
  }

  async update(customer: Customer): Promise<Customer> {
    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        taxId: customer.taxId,
        active: customer.active,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const customer = await prisma.customer.findFirst({
      where: { name },
      select: { id: true },
    });

    return !!customer;
  }

  async existsByTaxId(taxId: string): Promise<boolean> {
    const customer = await prisma.customer.findUnique({
      where: { taxId },
      select: { id: true },
    });

    return !!customer;
  }

  async count(filters?: {
    active?: boolean;
  }): Promise<number> {
    return await prisma.customer.count({ where: filters });
  }

  private mapToEntity(model: CustomerModel): Customer {
    return new Customer({
      id: model.id,
      name: model.name,
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
