import { Role } from './role.entity';

/**
 * User entity representing a system user
 * Contains business rules and validation logic
 */
export class User {
  private _id: string;
  private _username: string;
  private _email: string | null;
  private _passwordHash: string;
  private _name: string;
  private _roleId: string;
  private _role: Role | null;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    username: string;
    email: string | null;
    passwordHash: string;
    name: string;
    roleId: string;
    role?: Role | null;
    active?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._name = props.name;
    this._roleId = props.roleId;
    this._role = props.role || null;
    this._active = props.active ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get username(): string { return this._username; }
  get email(): string | null { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get name(): string { return this._name; }
  get roleId(): string { return this._roleId; }
  get role(): Role | null { return this._role; }
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
    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }
    this._name = name;
  }

  updateUsername(username: string): void {
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    this._username = username;
  }

  updateEmail(email: string | null): void {
    this._email = email;
  }

  updatePassword(passwordHash: string): void {
    this._passwordHash = passwordHash;
  }

  assignRole(roleId: string): void {
    this._roleId = roleId;
  }

  hasPermission(permission: string): boolean {
    if (!this._role) return false;
    return this._role.hasPermission(permission);
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new Error('User ID is required');
    }
    if (!this._username || this._username.trim() === '') {
      throw new Error('Username is required');
    }
    if (this._username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!this._passwordHash || this._passwordHash.trim() === '') {
      throw new Error('Password hash is required');
    }
    if (!this._name || this._name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!this._roleId || this._roleId.trim() === '') {
      throw new Error('Role ID is required');
    }
  }

  // Factory method for creating new user
  static create(props: {
    username: string;
    email: string | null;
    passwordHash: string;
    name: string;
    roleId: string;
  }): User {
    return new User({
      id: crypto.randomUUID(),
      username: props.username,
      email: props.email,
      passwordHash: props.passwordHash,
      name: props.name,
      roleId: props.roleId,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Convert to plain object
  toObject(): {
    id: string;
    username: string;
    email: string | null;
    passwordHash: string;
    name: string;
    roleId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      passwordHash: this._passwordHash,
      name: this._name,
      roleId: this._roleId,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
