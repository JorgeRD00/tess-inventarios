import { Purchase } from '@domain/entities/purchase.entity';
import { PurchaseItem } from '@domain/entities/purchase-item.entity';
import { PurchaseDTO, PurchaseItemDTO } from '../dtos/purchase.dto';

/**
 * Mapper for PurchaseItem entity
 */
export class PurchaseItemMapper {
  static toDTO(item: PurchaseItem): PurchaseItemDTO {
    return {
      id: item.id,
      purchaseId: item.purchaseId,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      subtotal: item.subtotal,
    };
  }

  static toDTOArray(items: PurchaseItem[]): PurchaseItemDTO[] {
    return items.map(item => this.toDTO(item));
  }
}

/**
 * Mapper for Purchase entity
 */
export class PurchaseMapper {
  static toDTO(purchase: Purchase): PurchaseDTO {
    return {
      id: purchase.id,
      folio: purchase.folio,
      supplierId: purchase.supplierId,
      supplier: purchase.supplier,
      date: purchase.date.toISOString(),
      subtotal: purchase.subtotal,
      tax: purchase.tax,
      total: purchase.total,
      observations: purchase.observations,
      userId: purchase.userId,
      user: purchase.user,
      items: PurchaseItemMapper.toDTOArray(purchase.items),
      createdAt: purchase.createdAt.toISOString(),
      updatedAt: purchase.updatedAt.toISOString(),
    };
  }

  static toDTOArray(purchases: Purchase[]): PurchaseDTO[] {
    return purchases.map(purchase => this.toDTO(purchase));
  }
}
