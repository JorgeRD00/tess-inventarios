import { MotorcycleCompatibility } from './motorcycle-compatibility.entity';
import { ProductImage } from './product-image.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

/**
 * Product entity representing an inventory item
 */
export class Product {
  private _id: string;
  private _internalCode: string;
  private _barcode: string | null;
  private _sku: string | null;
  private _name: string;
  private _description: string | null;
  private _brandId: string;
  private _brand: Brand | null;
  private _categoryId: string;
  private _category: Category | null;
  private _unit: string;
  private _stock: number;
  private _minStock: number;
  private _maxStock: number | null;
  private _location: string | null;
  private _purchasePrice: number;
  private _salePrice: number;
  private _supplierId: string | null;
  private _observations: string | null;
  private _active: boolean;
  private _images: ProductImage[];
  private _compatibilities: MotorcycleCompatibility[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    internalCode: string;
    barcode?: string | null;
    sku?: string | null;
    name: string;
    description?: string | null;
    brandId: string;
    brand?: Brand | null;
    categoryId: string;
    category?: Category | null;
    unit: string;
    stock?: number;
    minStock?: number;
    maxStock?: number | null;
    location?: string | null;
    purchasePrice?: number;
    salePrice?: number;
    supplierId?: string | null;
    observations?: string | null;
    active?: boolean;
    images?: ProductImage[];
    compatibilities?: MotorcycleCompatibility[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._internalCode = props.internalCode;
    this._barcode = props.barcode || null;
    this._sku = props.sku || null;
    this._name = props.name;
    this._description = props.description || null;
    this._brandId = props.brandId;
    this._brand = props.brand ?? null;
    this._categoryId = props.categoryId;
    this._category = props.category ?? null;
    this._unit = props.unit;
    this._stock = props.stock ?? 0;
    this._minStock = props.minStock ?? 0;
    this._maxStock = props.maxStock || null;
    this._location = props.location || null;
    this._purchasePrice = props.purchasePrice ?? 0;
    this._salePrice = props.salePrice ?? 0;
    this._supplierId = props.supplierId || null;
    this._observations = props.observations || null;
    this._active = props.active ?? true;
    this._images = props.images || [];
    this._compatibilities = props.compatibilities || [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get internalCode(): string { return this._internalCode; }
  get barcode(): string | null { return this._barcode; }
  get sku(): string | null { return this._sku; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get brandId(): string { return this._brandId; }
  get brand(): Brand | null { return this._brand; }
  get categoryId(): string { return this._categoryId; }
  get category(): Category | null { return this._category; }
  get unit(): string { return this._unit; }
  get stock(): number { return this._stock; }
  get minStock(): number { return this._minStock; }
  get maxStock(): number | null { return this._maxStock; }
  get location(): string | null { return this._location; }
  get purchasePrice(): number { return this._purchasePrice; }
  get salePrice(): number { return this._salePrice; }
  get supplierId(): string | null { return this._supplierId; }
  get observations(): string | null { return this._observations; }
  get active(): boolean { return this._active; }
  get images(): ProductImage[] { return this._images; }
  get compatibilities(): MotorcycleCompatibility[] { return this._compatibilities; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business methods
  activate(): void {
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  updateInternalCode(internalCode: string): void {
    this._internalCode = internalCode;
  }

  updateBarcode(barcode: string | null): void {
    this._barcode = barcode;
  }

  updateSku(sku: string | null): void {
    this._sku = sku;
  }

  updateName(name: string): void {
    this._name = name;
  }

  updateDescription(description: string | null): void {
    this._description = description;
  }

  updateBrandId(brandId: string): void {
    this._brandId = brandId;
  }

  updateCategoryId(categoryId: string): void {
    this._categoryId = categoryId;
  }

  updateUnit(unit: string): void {
    this._unit = unit;
  }

  updatePrices(purchasePrice: number, salePrice: number): void {
    if (purchasePrice < 0) throw new Error('Purchase price cannot be negative');
    if (salePrice < 0) throw new Error('Sale price cannot be negative');
    this._purchasePrice = purchasePrice;
    this._salePrice = salePrice;
  }

  updateStock(stock: number): void {
    if (stock < 0) throw new Error('Stock cannot be negative');
    this._stock = stock;
  }

  updateStockLimits(minStock: number, maxStock: number | null): void {
    if (minStock < 0) throw new Error('Minimum stock cannot be negative');
    if (maxStock !== null && maxStock < minStock) {
      throw new Error('Maximum stock must be greater than or equal to minimum stock');
    }
    this._minStock = minStock;
    this._maxStock = maxStock;
  }

  updateLocation(location: string | null): void {
    this._location = location;
  }

  updateSupplierId(supplierId: string | null): void {
    this._supplierId = supplierId;
  }

  updateObservations(observations: string | null): void {
    this._observations = observations;
  }

  addImage(image: ProductImage): void {
    this._images.push(image);
  }

  removeImage(imageId: string): void {
    this._images = this._images.filter(img => img.id !== imageId);
  }

  clearImages(): void {
    this._images = [];
  }

  addCompatibility(compatibility: MotorcycleCompatibility): void {
    this._compatibilities.push(compatibility);
  }

  removeCompatibility(compatibilityId: string): void {
    this._compatibilities = this._compatibilities.filter(c => c.id !== compatibilityId);
  }

  clearCompatibilities(): void {
    this._compatibilities = [];
  }

  isLowStock(): boolean {
    return this._stock <= this._minStock;
  }

  isOverStock(): boolean {
    return this._maxStock !== null && this._stock >= this._maxStock;
  }

  adjustStock(quantity: number): void {
    const newStock = this._stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }
    this._stock = newStock;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (!this._internalCode || this._internalCode.trim() === '') {
      throw new Error('Product internal code is required');
    }
    if (!this._name || this._name.trim() === '') {
      throw new Error('Product name is required');
    }
    if (this._name.length < 2) {
      throw new Error('Product name must be at least 2 characters');
    }
    if (!this._brandId || this._brandId.trim() === '') {
      throw new Error('Brand ID is required');
    }
    if (!this._categoryId || this._categoryId.trim() === '') {
      throw new Error('Category ID is required');
    }
    if (!this._unit || this._unit.trim() === '') {
      throw new Error('Unit is required');
    }
    if (this._stock < 0) {
      throw new Error('Stock cannot be negative');
    }
    if (this._minStock < 0) {
      throw new Error('Minimum stock cannot be negative');
    }
    if (this._purchasePrice < 0) {
      throw new Error('Purchase price cannot be negative');
    }
    if (this._salePrice < 0) {
      throw new Error('Sale price cannot be negative');
    }
  }

  // Factory method
  static create(props: {
    internalCode: string;
    barcode?: string;
    sku?: string;
    name: string;
    description?: string;
    brandId: string;
    categoryId: string;
    unit: string;
    stock?: number;
    minStock?: number;
    maxStock?: number;
    location?: string;
    purchasePrice?: number;
    salePrice?: number;
    supplierId?: string;
    observations?: string;
  }): Product {
    return new Product({
      id: crypto.randomUUID(),
      internalCode: props.internalCode,
      barcode: props.barcode,
      sku: props.sku,
      name: props.name,
      description: props.description,
      brandId: props.brandId,
      categoryId: props.categoryId,
      unit: props.unit,
      stock: props.stock,
      minStock: props.minStock,
      maxStock: props.maxStock,
      location: props.location,
      purchasePrice: props.purchasePrice,
      salePrice: props.salePrice,
      supplierId: props.supplierId,
      observations: props.observations,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toObject(): object {
    return {
      id: this._id,
      internalCode: this._internalCode,
      barcode: this._barcode,
      sku: this._sku,
      name: this._name,
      description: this._description,
      brandId: this._brandId,
      brand: this._brand ? this._brand.toObject() : null,
      categoryId: this._categoryId,
      category: this._category ? this._category.toObject() : null,
      unit: this._unit,
      stock: this._stock,
      minStock: this._minStock,
      maxStock: this._maxStock,
      location: this._location,
      purchasePrice: this._purchasePrice,
      salePrice: this._salePrice,
      supplierId: this._supplierId,
      observations: this._observations,
      active: this._active,
      images: this._images.map(img => img.toObject()),
      compatibilities: this._compatibilities.map(c => c.toObject()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
