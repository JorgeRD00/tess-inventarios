/**
 * PurchaseItem entity representing an item in a purchase order
 */
export class PurchaseItem {
  private _id: string;
  private _purchaseId: string;
  private _productId: string;
  private _quantity: number;
  private _unitCost: number;
  private _subtotal: number;

  constructor(props: {
    id: string;
    purchaseId: string;
    productId: string;
    quantity: number;
    unitCost: number;
    subtotal: number;
  }) {
    this._id = props.id;
    this._purchaseId = props.purchaseId;
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._unitCost = props.unitCost;
    this._subtotal = props.subtotal;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get purchaseId(): string { return this._purchaseId; }
  get productId(): string { return this._productId; }
  get quantity(): number { return this._quantity; }
  get unitCost(): number { return this._unitCost; }
  get subtotal(): number { return this._subtotal; }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    this._quantity = quantity;
    this.calculateSubtotal();
  }

  updateUnitCost(unitCost: number): void {
    if (unitCost < 0) throw new Error('Unit cost cannot be negative');
    this._unitCost = unitCost;
    this.calculateSubtotal();
  }

  private calculateSubtotal(): void {
    this._subtotal = this._quantity * this._unitCost;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('PurchaseItem ID is required');
    }
    if (!this._purchaseId || this._purchaseId.trim() === '') {
      throw new Error('Purchase ID is required');
    }
    if (!this._productId || this._productId.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (this._quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (this._unitCost < 0) {
      throw new Error('Unit cost cannot be negative');
    }
  }

  // Factory method
  static create(props: {
    purchaseId: string;
    productId: string;
    quantity: number;
    unitCost: number;
  }): PurchaseItem {
    const subtotal = props.quantity * props.unitCost;
    return new PurchaseItem({
      id: crypto.randomUUID(),
      purchaseId: props.purchaseId,
      productId: props.productId,
      quantity: props.quantity,
      unitCost: props.unitCost,
      subtotal,
    });
  }

  toObject(): object {
    return {
      id: this._id,
      purchaseId: this._purchaseId,
      productId: this._productId,
      quantity: this._quantity,
      unitCost: this._unitCost,
      subtotal: this._subtotal,
    };
  }
}
