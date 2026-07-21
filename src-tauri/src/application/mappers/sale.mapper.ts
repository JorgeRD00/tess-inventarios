import { Sale } from '@domain/entities/sale.entity';
import { SaleItem } from '@domain/entities/sale-item.entity';
import { SaleDTO, SaleItemDTO } from '../dtos/sale.dto';

/**
 * Mapper for SaleItem entity
 */
export class SaleItemMapper {
  static toDTO(item: SaleItem): SaleItemDTO {
    return {
      id: item.id,
      saleId: item.saleId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      subtotal: item.subtotal,
    };
  }

  static toDTOArray(items: SaleItem[]): SaleItemDTO[] {
    return items.map(item => this.toDTO(item));
  }
}

/**
 * Mapper for Sale entity
 */
export class SaleMapper {
  static toDTO(sale: Sale): SaleDTO {
    return {
      id: sale.id,
      folio: sale.folio,
      customerId: sale.customerId,
      customer: sale.customer,
      date: sale.date.toISOString(),
      subtotal: sale.subtotal,
      discount: sale.discount,
      tax: sale.tax,
      total: sale.total,
      paymentMethodId: sale.paymentMethodId,
      observations: sale.observations,
      userId: sale.userId,
      user: sale.user,
      items: SaleItemMapper.toDTOArray(sale.items),
      createdAt: sale.createdAt.toISOString(),
      updatedAt: sale.updatedAt.toISOString(),
    };
  }

  static toDTOArray(sales: Sale[]): SaleDTO[] {
    return sales.map(sale => this.toDTO(sale));
  }
}
