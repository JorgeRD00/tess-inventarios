import { Permission } from './permission.entity';

/**
 * Role entity representing a user role with permissions
 */
export class Role {
  private _id: string;
  private _name: string;
  private _description: string | null;
  private _permissions: Permission[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    description: string | null;
    permissions?: Permission[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._permissions = props.permissions || [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get permissions(): Permission[] { return [...this._permissions]; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business methods
  addPermission(permission: Permission): void {
    if (!this.hasPermission(permission.name)) {
      this._permissions.push(permission);
    }
  }

  removePermission(permissionId: string): void {
    this._permissions = this._permissions.filter(p => p.id !== permissionId);
  }

  hasPermission(permissionName: string): boolean {
    return this._permissions.some(p => p.name === permissionName);
  }

  hasAnyPermissions(permissionNames: string[]): boolean {
    return permissionNames.some(name => this.hasPermission(name));
  }

  hasAllPermissions(permissionNames: string[]): boolean {
    return permissionNames.every(name => this.hasPermission(name));
  }

  updateName(name: string): void {
    this._name = name;
  }

  updateDescription(description: string | null): void {
    this._description = description;
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('Role ID is required');
    }
    if (!this._name || this._name.trim() === '') {
      throw new Error('Role name is required');
    }
  }

  // Factory method
  static create(props: {
    name: string;
    description?: string | null;
  }): Role {
    return new Role({
      id: crypto.randomUUID(),
      name: props.name,
      description: props.description || null,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toObject(): {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
