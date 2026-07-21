/**
 * ProductImage entity representing an image associated with a product
 */
export class ProductImage {
  private _id: string;
  private _productId: string;
  private _path: string;
  private _order: number;
  private _createdAt: Date;

  constructor(props: {
    id: string;
    productId: string;
    path: string;
    order?: number;
    createdAt: Date;
  }) {
    this._id = props.id;
    this._productId = props.productId;
    this._path = props.path;
    this._order = props.order ?? 0;
    this._createdAt = props.createdAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get productId(): string { return this._productId; }
  get path(): string { return this._path; }
  get order(): number { return this._order; }
  get createdAt(): Date { return this._createdAt; }

  updateOrder(order: number): void {
    this._order = order;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('ProductImage ID is required');
    }
    if (!this._productId || this._productId.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (!this._path || this._path.trim() === '') {
      throw new Error('Image path is required');
    }
  }

  // Factory method
  static create(props: {
    productId: string;
    path: string;
    order?: number;
  }): ProductImage {
    return new ProductImage({
      id: crypto.randomUUID(),
      productId: props.productId,
      path: props.path,
      order: props.order,
      createdAt: new Date(),
    });
  }

  toObject(): object {
    return {
      id: this._id,
      productId: this._productId,
      path: this._path,
      order: this._order,
      createdAt: this._createdAt,
    };
  }
}
