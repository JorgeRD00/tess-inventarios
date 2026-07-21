import { Purchase } from '@domain/entities/purchase.entity';
import { PurchaseItem } from '@domain/entities/purchase-item.entity';
import { IPurchaseRepository } from '@domain/repositories/purchase.repository.interface';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { PurchaseMapper } from '../mappers/purchase.mapper';
import {
  PurchaseDTO,
  PurchaseCreateDTO,
  PurchaseUpdateDTO,
} from '../dtos/purchase.dto';
import { ValidationError, NotFoundError, ConflictError } from '@shared/errors/custom-error';
import { isRequired, isPositive, isNonNegative } from '@shared/validators/validators';

/**
 * Application service for Purchase operations
 */
export class PurchaseService {
  constructor(
    private purchaseRepository: IPurchaseRepository,
    private productRepository: IProductRepository,
  ) {}

  /**
   * Get all purchases with optional filters
   */
  async getPurchases(filters?: {
    supplierId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PurchaseDTO[]> {
    const parsedFilters: any = {};
    if (filters?.supplierId) parsedFilters.supplierId = filters.supplierId;
    if (filters?.startDate) parsedFilters.startDate = new Date(filters.startDate);
    if (filters?.endDate) parsedFilters.endDate = new Date(filters.endDate);

    const purchases = await this.purchaseRepository.findAll(parsedFilters);
    return PurchaseMapper.toDTOArray(purchases);
  }

  /**
   * Get purchase by ID
   */
  async getPurchaseById(id: string): Promise<PurchaseDTO> {
    const purchase = await this.purchaseRepository.findById(id);

    if (!purchase) {
      throw new NotFoundError('Purchase', id);
    }

    return PurchaseMapper.toDTO(purchase);
  }

  /**
   * Get purchase by folio
   */
  async getPurchaseByFolio(folio: string): Promise<PurchaseDTO> {
    const purchase = await this.purchaseRepository.findByFolio(folio);

    if (!purchase) {
      throw new NotFoundError('Purchase', folio);
    }

    return PurchaseMapper.toDTO(purchase);
  }

  /**
   * Create a new purchase
   */
  async createPurchase(data: PurchaseCreateDTO): Promise<PurchaseDTO> {
    // Validate input
    this.validatePurchaseCreate(data);

    // Check folio uniqueness
    const folioExists = await this.purchaseRepository.existsByFolio(data.folio);
    if (folioExists) {
      throw new ConflictError('Purchase folio already exists');
    }

    // Create purchase entity
    const purchase = Purchase.create({
      folio: data.folio,
      supplierId: data.supplierId,
      userId: data.userId,
      observations: data.observations,
    });

    // Add items and update product stock
    for (const itemData of data.items) {
      const product = await this.productRepository.findById(itemData.productId);
      if (!product) {
        throw new NotFoundError('Product', itemData.productId);
      }

      const item = PurchaseItem.create({
        purchaseId: purchase.id,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unitCost: itemData.unitCost,
      });

      purchase.addItem(item);
    }

    // Save purchase
    const createdPurchase = await this.purchaseRepository.create(purchase);

    // Update product stock
    for (const item of createdPurchase.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(item.quantity);
        await this.productRepository.update(product);
      }
    }

    return PurchaseMapper.toDTO(createdPurchase);
  }

  /**
   * Update an existing purchase
   */
  async updatePurchase(data: PurchaseUpdateDTO): Promise<PurchaseDTO> {
    const purchase = await this.purchaseRepository.findById(data.id);
    if (!purchase) {
      throw new NotFoundError('Purchase', data.id);
    }

    // For simplicity, updates will replace items and adjust stock accordingly
    if (data.folio !== undefined) {
      if (!isRequired(data.folio)) {
        throw new ValidationError('Folio is required');
      }

      const folioExists = await this.purchaseRepository.existsByFolio(data.folio);
      if (folioExists && data.folio !== purchase.folio) {
        throw new ConflictError('Purchase folio already exists');
      }

      // Purchase entity doesn't have updateFolio, use Object.assign or add method
      (purchase as any)._folio = data.folio;
    }

    if (data.supplierId !== undefined) {
      if (!isRequired(data.supplierId)) {
        throw new ValidationError('Supplier ID is required');
      }
      (purchase as any)._supplierId = data.supplierId;
    }

    if (data.observations !== undefined) {
      purchase.updateObservations(data.observations || null);
    }

    if (data.date !== undefined) {
      (purchase as any)._date = new Date(data.date);
    }

    // Revert old stock changes
    for (const item of purchase.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(-item.quantity);
        await this.productRepository.update(product);
      }
    }

    // Replace items
    if (data.items !== undefined) {
      // Clear current items
      (purchase as any)._items = [];

      for (const itemData of data.items) {
        const product = await this.productRepository.findById(itemData.productId);
        if (!product) {
          throw new NotFoundError('Product', itemData.productId);
        }

        const item = PurchaseItem.create({
          purchaseId: purchase.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          unitCost: itemData.unitCost,
        });

        purchase.addItem(item);
      }

      purchase.calculateTotals();
    }

    // Save updated purchase
    const updatedPurchase = await this.purchaseRepository.update(purchase);

    // Apply new stock changes
    for (const item of updatedPurchase.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(item.quantity);
        await this.productRepository.update(product);
      }
    }

    return PurchaseMapper.toDTO(updatedPurchase);
  }

  /**
   * Delete a purchase
   */
  async deletePurchase(id: string): Promise<void> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('Purchase', id);
    }

    // Revert stock changes
    for (const item of purchase.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.adjustStock(-item.quantity);
        await this.productRepository.update(product);
      }
    }

    await this.purchaseRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validatePurchaseCreate(data: PurchaseCreateDTO): void {
    if (!isRequired(data.folio)) {
      throw new ValidationError('Folio is required');
    }
    if (!isRequired(data.supplierId)) {
      throw new ValidationError('Supplier ID is required');
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
      if (!isNonNegative(item.unitCost)) {
        throw new ValidationError('Unit cost cannot be negative');
      }
    }
  }
}
