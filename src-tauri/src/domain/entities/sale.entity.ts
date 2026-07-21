import { SaleItem } from './sale-item.entity';

/**
 * Sale entity representing a sale transaction to a customer
 */
export class Sale {
  private _id: string;
  private _folio: string;
  private _customerId: string | null;
  private _date: Date;
  private _subtotal: number;
  private _discount: number;
  private _tax: number;
  private _total: number;
  private _paymentMethodId: string;
  private _observations: string | null;
  private _userId: string;
  private _user?: { id: string; name: string };
  private _customer?: { id: string; name: string };
  private _items: SaleItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    folio: string;
    customerId: string | null;
    date: Date;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethodId: string;
    observations: string | null;
    userId: string;
    user?: { id: string; name: string };
    customer?: { id: string; name: string };
    items?: SaleItem[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._folio = props.folio;
    this._customerId = props.customerId;
    this._date = props.date;
    this._subtotal = props.subtotal;
    this._discount = props.discount;
    this._tax = props.tax;
    this._total = props.total;
    this._paymentMethodId = props.paymentMethodId;
    this._observations = props.observations;
    this._userId = props.userId;
    this._user = props.user;
    this._customer = props.customer;
    this._items = props.items || [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get folio(): string { return this._folio; }
  get customerId(): string | null { return this._customerId; }
  get date(): Date { return this._date; }
  get subtotal(): number { return this._subtotal; }
  get discount(): number { return this._discount; }
  get tax(): number { return this._tax; }
  get total(): number { return this._total; }
  get paymentMethodId(): string { return this._paymentMethodId; }
  get observations(): string | null { return this._observations; }
  get userId(): string { return this._userId; }
  get user(): { id: string; name: string } | undefined { return this._user; }
  get customer(): { id: string; name: string } | undefined { return this._customer; }
  get items(): SaleItem[] { return this._items; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business methods
  addItem(item: SaleItem): void {
    this._items.push(item);
    this.calculateTotals();
  }

  removeItem(itemId: string): void {
    this._items = this._items.filter(item => item.id !== itemId);
    this.calculateTotals();
  }

  updateCustomerId(customerId: string | null): void {
    this._customerId = customerId;
  }

  updatePaymentMethodId(paymentMethodId: string): void {
    this._paymentMethodId = paymentMethodId;
  }

  updateObservations(observations: string | null): void {
    this._observations = observations;
  }

  updateDiscount(discount: number): void {
    if (discount < 0) throw new Error('Discount cannot be negative');
    this._discount = discount;
    this.calculateTotals();
  }

  calculateTotals(): void {
    this._subtotal = this._items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const taxableAmount = Math.max(0, this._subtotal - this._discount);
    this._tax = taxableAmount * 0.16;
    this._total = taxableAmount + this._tax;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Sale ID is required');
    }
    if (!this._folio || this._folio.trim() === '') {
      throw new Error('Sale folio is required');
    }
    if (!this._paymentMethodId || this._paymentMethodId.trim() === '') {
      throw new Error('Payment method ID is required');
    }
    if (!this._userId || this._userId.trim() === '') {
      throw new Error('User ID is required');
    }
    if (this._subtotal < 0) throw new Error('Subtotal cannot be negative');
    if (this._discount < 0) throw new Error('Discount cannot be negative');
    if (this._tax < 0) throw new Error('Tax cannot be negative');
    if (this._total < 0) throw new Error('Total cannot be negative');
  }

  // Factory method
  static create(props: {
    folio: string;
    customerId?: string;
    paymentMethodId: string;
    userId: string;
    observations?: string;
  }): Sale {
    return new Sale({
      id: crypto.randomUUID(),
      folio: props.folio,
      customerId: props.customerId || null,
      date: new Date(),
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      paymentMethodId: props.paymentMethodId,
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
      customerId: this._customerId,
      customer: this._customer,
      date: this._date,
      subtotal: this._subtotal,
      discount: this._discount,
      tax: this._tax,
      total: this._total,
      paymentMethodId: this._paymentMethodId,
      observations: this._observations,
      userId: this._userId,
      user: this._user,
      items: this._items.map(item => item.toObject()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
