import { User } from '../entities/user.entity';

/**
 * Interface for User repository
 * Defines the contract for user data access operations
 */
export interface IUserRepository {
  // CRUD operations
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: {
    active?: boolean;
    roleId?: string;
  }): Promise<User[]>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;

  // Business-specific queries
  count(filters?: {
    active?: boolean;
    roleId?: string;
  }): Promise<number>;
  
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}
