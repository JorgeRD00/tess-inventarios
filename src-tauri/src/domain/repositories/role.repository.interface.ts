import { Role } from '../entities/role.entity';

/**
 * Interface for Role repository
 */
export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  create(role: Role): Promise<Role>;
  update(role: Role): Promise<Role>;
  delete(id: string): Promise<void>;
  
  existsByName(name: string): Promise<boolean>;
}
