import { PurchaseItem } from './purchase-item.entity';

/**
 * Purchase entity representing a purchase order from a supplier
 */
export class Purchase {
  private _id: string;
  private _folio: string;
  private _supplierId: string;
  private _date: Date;
  private _subtotal: number;
  private _tax: number;
  private _total: number;
  private _observations: string | null;
  private _userId: string;
  private _user?: { id: string; name: string };
  private _supplier?: { id: string; name: string };
  private _items: PurchaseItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    folio: string;
    supplierId: string;
    date: Date;
    subtotal: number;
    tax: number;
    total: number;
    observations: string | null;
    userId: string;
    user?: { id: string; name: string };
    supplier?: { id: string; name: string };
    items?: PurchaseItem[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._folio = props.folio;
    this._supplierId = props.supplierId;
    this._date = props.date;
    this._subtotal = props.subtotal;
    this._tax = props.tax;
    this._total = props.total;
    this._observations = props.observations;
    this._userId = props.userId;
    this._user = props.user;
    this._supplier = props.supplier;
    this._items = props.items || [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get folio(): string { return this._folio; }
  get supplierId(): string { return this._supplierId; }
  get date(): Date { return this._date; }
  get subtotal(): number { return this._subtotal; }
  get tax(): number { return this._tax; }
  get total(): number { return this._total; }
  get observations(): string | null { return this._observations; }
  get userId(): string { return this._userId; }
  get user(): { id: string; name: string } | undefined { return this._user; }
  get supplier(): { id: string; name: string } | undefined { return this._supplier; }
  get items(): PurchaseItem[] { return this._items; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business methods
  addItem(item: PurchaseItem): void {
    this._items.push(item);
    this.calculateTotals();
  }

  removeItem(itemId: string): void {
    this._items = this._items.filter(item => item.id !== itemId);
    this.calculateTotals();
  }

  updateObservations(observations: string | null): void {
    this._observations = observations;
  }

  calculateTotals(): void {
    this._subtotal = this._items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    this._tax = this._subtotal * 0.16;
    this._total = this._subtotal + this._tax;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Purchase ID is required');
    }
    if (!this._folio || this._folio.trim() === '') {
      throw new Error('Purchase folio is required');
    }
    if (!this._supplierId || this._supplierId.trim() === '') {
      throw new Error('Supplier ID is required');
    }
    if (!this._userId || this._userId.trim() === '') {
      throw new Error('User ID is required');
    }
    if (this._subtotal < 0) throw new Error('Subtotal cannot be negative');
    if (this._tax < 0) throw new Error('Tax cannot be negative');
    if (this._total < 0) throw new Error('Total cannot be negative');
  }

  // Factory method
  static create(props: {
    folio: string;
    supplierId: string;
    userId: string;
    observations?: string;
  }): Purchase {
    return new Purchase({
      id: crypto.randomUUID(),
      folio: props.folio,
      supplierId: props.supplierId,
      date: new Date(),
      subtotal: 0,
      tax: 0,
      total: 0,
      observations: props.observations || null,
      userId: props.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toObject(): object {
    return {
      id: this._id,
      folio: this._folio,
      supplierId: this._supplierId,
      supplier: this._supplier,
      date: this._date,
      subtotal: this._subtotal,
      tax: this._tax,
      total: this._total,
      observations: this._observations,
      userId: this._userId,
      user: this._user,
      items: this._items.map(item => item.toObject()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
