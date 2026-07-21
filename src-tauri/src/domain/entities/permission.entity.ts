/**
 * Permission entity representing a system permission
 */
export class Permission {
  private _id: string;
  private _name: string;
  private _description: string | null;
  private _createdAt: Date;

  constructor(props: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get createdAt(): Date { return this._createdAt; }

  // Business methods
  updateName(name: string): void {
    this._name = name;
  }

  updateDescription(description: string | null): void {
    this._description = description;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Permission ID is required');
    }
    if (!this._name || this._name.trim() === '') {
      throw new Error('Permission name is required');
    }
  }

  // Factory method
  static create(props: {
    name: string;
    description?: string | null;
  }): Permission {
    return new Permission({
      id: crypto.randomUUID(),
      name: props.name,
      description: props.description || null,
      createdAt: new Date(),
    });
  }

  toObject(): {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
    };
  }
}
