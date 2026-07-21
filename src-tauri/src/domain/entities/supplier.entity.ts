/**
 * Supplier entity representing a product supplier
 */
export class Supplier {
  private _id: string;
  private _name: string;
  private _contactName: string | null;
  private _email: string | null;
  private _phone: string | null;
  private _address: string | null;
  private _taxId: string | null;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    taxId: string | null;
    active?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._contactName = props.contactName;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._taxId = props.taxId;
    this._active = props.active ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get contactName(): string | null { return this._contactName; }
  get email(): string | null { return this._email; }
  get phone(): string | null { return this._phone; }
  get address(): string | null { return this._address; }
  get taxId(): string | null { return this._taxId; }
  get active(): boolean { return this._active; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business methods
  activate(): void {
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  updateName(name: string): void {
    this._name = name;
  }

  updateContactName(contactName: string | null): void {
    this._contactName = contactName;
  }

  updateEmail(email: string | null): void {
    this._email = email;
  }

  updatePhone(phone: string | null): void {
    this._phone = phone;
  }

  updateAddress(address: string | null): void {
    this._address = address;
  }

  updateTaxId(taxId: string | null): void {
    this._taxId = taxId;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Supplier ID is required');
    }
    if (!this._name || this._name.trim() === '') {
      throw new Error('Supplier name is required');
    }
    if (this._name.length < 2) {
      throw new Error('Supplier name must be at least 2 characters');
    }
    if (this._email && !this.isValidEmail(this._email)) {
      throw new Error('Invalid email format');
    }
    if (this._phone && this._phone.length < 8) {
      throw new Error('Phone number must be at least 8 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Factory method
  static create(props: {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
  }): Supplier {
    return new Supplier({
      id: crypto.randomUUID(),
      name: props.name,
      contactName: props.contactName || null,
      email: props.email || null,
      phone: props.phone || null,
      address: props.address || null,
      taxId: props.taxId || null,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toObject(): {
    id: string;
    name: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    taxId: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      contactName: this._contactName,
      email: this._email,
      phone: this._phone,
      address: this._address,
      taxId: this._taxId,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
