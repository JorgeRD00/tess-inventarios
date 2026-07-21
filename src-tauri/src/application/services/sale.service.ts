import { Sale } from '@domain/entities/sale.entity';
import { SaleItem } from '@domain/entities/sale-item.entity';
import { ISaleRepository } from '@domain/repositories/sale.repository.interface';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { SaleMapper } from '../mappers/sale.mapper';
import { SaleDTO, SaleCreateDTO, SaleUpdateDTO } from '../dtos/sale.dto';
import { ValidationError, NotFoundError, ConflictError } from '@shared/errors/custom-error';
import { isRequired, isPositive, isNonNegative } from '@shared/validators/validators';

/**
 * Application service for Sale operations
 */
export class SaleService {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository,
  ) {}

  /**
   * Get all sales with optional filters
   */
  async getSales(filters?: {
    customerId?: string;
    paymentMethodId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<SaleDTO[]> {
    const parsedFilters: any = {};
    if (filters?.customerId) parsedFilters.customerId = filters.customerId;
    if (filters?.paymentMethodId) parsedFilters.paymentMethodId = filters.paymentMethodId;
    if (filters?.startDate) parsedFilters.startDate = new Date(filters.startDate);
    if (filters?.endDate) parsedFilters.endDate = new Date(filters.endDate);

    const sales = await this.saleRepository.findAll(parsedFilters);
    return SaleMapper.toDTOArray(sales);
  }

  /**
   * Get sale by ID
   */
  async getSaleById(id: string): Promise<SaleDTO> {
    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new NotFoundError('Sale', id);
    }

    return SaleMapper.toDTO(sale);
  }

  /**
   * Get sale by folio
   */
  async getSaleByFolio(folio: string): Promise<SaleDTO> {
    const sale = await this.saleRepository.findByFolio(folio);

    if (!sale) {
      throw new NotFoundError('Sale', folio);
    }

    return SaleMapper.toDTO(sale);
  }

  /**
   * Create a new sale
   */
  async createSale(data: SaleCreateDTO): Promise<SaleDTO> {
    // Validate input
    this.validateSaleCreate(data);

    // Check folio uniqueness
    const folioExists = await this.saleRepository.existsByFolio(data.folio);
    if (folioExists) {
      throw new ConflictError('Sale folio already exists');
    }

    // Create sale entity
    const sale = Sale.create({
      folio: data.folio,
      customerId: data.customerId,
      paymentMethodId: data.paymentMethodId,
      userId: data.userId,
      observations: data.observations,
    });

    if (data.discount !== undefined) {
      sale.updateDiscount(data.discount);
    }

    // Add items and validate stock
    for (const itemData of data.items) {
      const product = await this.productRepository.findById(itemData.productId);
      if (!product) {
        throw new NotFoundError('Product', itemData.productId);
      }

      if (product.stock < itemData.quantity) {
        throw new ValidationError(`Insufficient stock for product ${product.name}. Available: ${product.stock}, requested: ${itemData.quantity}`);
      }

      const item = SaleItem.create({
        saleId: sale.id,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice,
        discount: itemData.discount,
      });

      sale.addItem(item);
    }

    // Save sale
    const createdSale = await this.saleRepository.create(sale);

    // Decrease product stock
    for (const item of createdSale.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(-item.quantity);
        await this.productRepository.update(product);
      }
    }

    return SaleMapper.toDTO(createdSale);
  }

  /**
   * Update an existing sale
   */
  async updateSale(data: SaleUpdateDTO): Promise<SaleDTO> {
    const sale = await this.saleRepository.findById(data.id);
    if (!sale) {
      throw new NotFoundError('Sale', data.id);
    }

    // Revert old stock changes
    for (const item of sale.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(item.quantity);
        await this.productRepository.update(product);
      }
    }

    if (data.folio !== undefined) {
      if (!isRequired(data.folio)) {
        throw new ValidationError('Folio is required');
      }

      const folioExists = await this.saleRepository.existsByFolio(data.folio);
      if (folioExists && data.folio !== sale.folio) {
        throw new ConflictError('Sale folio already exists');
      }

      (sale as any)._folio = data.folio;
    }

    if (data.customerId !== undefined) {
      sale.updateCustomerId(data.customerId || null);
    }

    if (data.paymentMethodId !== undefined) {
      if (!isRequired(data.paymentMethodId)) {
        throw new ValidationError('Payment method ID is required');
      }
      sale.updatePaymentMethodId(data.paymentMethodId);
    }

    if (data.observations !== undefined) {
      sale.updateObservations(data.observations || null);
    }

    if (data.date !== undefined) {
      (sale as any)._date = new Date(data.date);
    }

    if (data.discount !== undefined) {
      sale.updateDiscount(data.discount);
    }

    // Replace items
    if (data.items !== undefined) {
      // Clear current items
      (sale as any)._items = [];

      for (const itemData of data.items) {
        const product = await this.productRepository.findById(itemData.productId);
        if (!product) {
          throw new NotFoundError('Product', itemData.productId);
        }

        if (product.stock < itemData.quantity) {
          throw new ValidationError(`Insufficient stock for product ${product.name}. Available: ${product.stock}, requested: ${itemData.quantity}`);
        }

        const item = SaleItem.create({
          saleId: sale.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          discount: itemData.discount,
        });

        sale.addItem(item);
      }
    }

    // Save updated sale
    const updatedSale = await this.saleRepository.update(sale);

    // Apply new stock changes
    for (const item of updatedSale.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(-item.quantity);
        await this.productRepository.update(product);
      }
    }

    return SaleMapper.toDTO(updatedSale);
  }

  /**
   * Delete a sale
   */
  async deleteSale(id: string): Promise<void> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundError('Sale', id);
    }

    // Revert stock changes
    for (const item of sale.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(item.quantity);
        await this.productRepository.update(product);
      }
    }

    await this.saleRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validateSaleCreate(data: SaleCreateDTO): void {
    if (!isRequired(data.folio)) {
      throw new ValidationError('Folio is required');
    }
    if (!isRequired(data.paymentMethodId)) {
      throw new ValidationError('Payment method ID is required');
    }
    if (!isRequired(data.userId)) {
      throw new ValidationError('User ID is required');
    }
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    for (const item of data.items) {
      if (!isRequired(item.productId)) {
        throw new ValidationError('Product ID is required for all items');
      }
      if (!isPositive(item.quantity)) {
        throw new ValidationError('Quantity must be greater than zero');
      }
      if (!isNonNegative(item.unitPrice)) {
        throw new ValidationError('Unit price cannot be negative');
      }
      if (item.discount !== undefined && item.discount < 0) {
        throw new ValidationError('Discount cannot be negative');
      }
    }

    if (data.discount !== undefined && data.discount < 0) {
      throw new ValidationError('Discount cannot be negative');
    }
  }
}
