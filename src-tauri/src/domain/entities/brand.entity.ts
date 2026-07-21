/**
 * Brand entity representing a product brand
 */
export class Brand {
  private _id: string;
  private _name: string;
  private _description: string | null;
  private _website: string | null;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    active?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._website = props.website;
    this._active = props.active ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get website(): string | null { return this._website; }
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

  updateDescription(description: string | null): void {
    this._description = description;
  }

  updateWebsite(website: string | null): void {
    this._website = website;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Brand ID is required');
    }
    if (!this._name || this._name.trim() === '') {
      throw new Error('Brand name is required');
    }
    if (this._name.length < 2) {
      throw new Error('Brand name must be at least 2 characters');
    }
  }

  // Factory method
  static create(props: {
    name: string;
    description?: string | null;
    website?: string | null;
  }): Brand {
    return new Brand({
      id: crypto.randomUUID(),
      name: props.name,
      description: props.description || null,
      website: props.website || null,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toObject(): {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      website: this._website,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
