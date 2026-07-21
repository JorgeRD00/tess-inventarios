/**
 * MotorcycleCompatibility entity representing a motorcycle model compatibility for a product
 */
export class MotorcycleCompatibility {
  private _id: string;
  private _productId: string;
  private _brand: string;
  private _model: string;
  private _year: string | null;
  private _notes: string | null;

  constructor(props: {
    id: string;
    productId: string;
    brand: string;
    model: string;
    year?: string | null;
    notes?: string | null;
  }) {
    this._id = props.id;
    this._productId = props.productId;
    this._brand = props.brand;
    this._model = props.model;
    this._year = props.year || null;
    this._notes = props.notes || null;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get productId(): string { return this._productId; }
  get brand(): string { return this._brand; }
  get model(): string { return this._model; }
  get year(): string | null { return this._year; }
  get notes(): string | null { return this._notes; }

  updateBrand(brand: string): void {
    this._brand = brand;
  }

  updateModel(model: string): void {
    this._model = model;
  }

  updateYear(year: string | null): void {
    this._year = year;
  }

  updateNotes(notes: string | null): void {
    this._notes = notes;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('MotorcycleCompatibility ID is required');
    }
    if (!this._productId || this._productId.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (!this._brand || this._brand.trim() === '') {
      throw new Error('Brand is required');
    }
    if (!this._model || this._model.trim() === '') {
      throw new Error('Model is required');
    }
  }

  // Factory method
  static create(props: {
    productId: string;
    brand: string;
    model: string;
    year?: string;
    notes?: string;
  }): MotorcycleCompatibility {
    return new MotorcycleCompatibility({
      id: crypto.randomUUID(),
      productId: props.productId,
      brand: props.brand,
      model: props.model,
      year: props.year,
      notes: props.notes,
    });
  }

  toObject(): object {
    return {
      id: this._id,
      productId: this._productId,
      brand: this._brand,
      model: this._model,
      year: this._year,
      notes: this._notes,
    };
  }
}
