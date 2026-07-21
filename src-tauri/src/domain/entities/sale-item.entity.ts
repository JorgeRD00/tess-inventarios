/**
 * SaleItem entity representing an item in a sale
 */
export class SaleItem {
  private _id: string;
  private _saleId: string;
  private _productId: string;
  private _quantity: number;
  private _unitPrice: number;
  private _discount: number;
  private _subtotal: number;

  constructor(props: {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
  }) {
    this._id = props.id;
    this._saleId = props.saleId;
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._discount = props.discount;
    this._subtotal = props.subtotal;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get saleId(): string { return this._saleId; }
  get productId(): string { return this._productId; }
  get quantity(): number { return this._quantity; }
  get unitPrice(): number { return this._unitPrice; }
  get discount(): number { return this._discount; }
  get subtotal(): number { return this._subtotal; }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    this._quantity = quantity;
    this.calculateSubtotal();
  }

  updateUnitPrice(unitPrice: number): void {
    if (unitPrice < 0) throw new Error('Unit price cannot be negative');
    this._unitPrice = unitPrice;
    this.calculateSubtotal();
  }

  updateDiscount(discount: number): void {
    if (discount < 0) throw new Error('Discount cannot be negative');
    this._discount = discount;
    this.calculateSubtotal();
  }

  private calculateSubtotal(): void {
    const lineTotal = this._quantity * this._unitPrice;
    this._subtotal = Math.max(0, lineTotal - this._discount);
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('SaleItem ID is required');
    }
    if (!this._saleId || this._saleId.trim() === '') {
      throw new Error('Sale ID is required');
    }
    if (!this._productId || this._productId.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (this._quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (this._unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
    if (this._discount < 0) {
      throw new Error('Discount cannot be negative');
    }
  }

  // Factory method
  static create(props: {
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }): SaleItem {
    const lineTotal = props.quantity * props.unitPrice;
    const discount = props.discount || 0;
    const subtotal = Math.max(0, lineTotal - discount);
    return new SaleItem({
      id: crypto.randomUUID(),
      saleId: props.saleId,
      productId: props.productId,
      quantity: props.quantity,
      unitPrice: props.unitPrice,
      discount,
      subtotal,
    });
  }

  toObject(): object {
    return {
      id: this._id,
      saleId: this._saleId,
      productId: this._productId,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      discount: this._discount,
      subtotal: this._subtotal,
    };
  }
}
