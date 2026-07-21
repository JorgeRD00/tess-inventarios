import { Permission } from '../entities/permission.entity';

/**
 * Interface for Permission repository
 */
export interface IPermissionRepository {
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  create(permission: Permission): Promise<Permission>;
  update(permission: Permission): Promise<Permission>;
  delete(id: string): Promise<void>;
  
  existsByName(name: string): Promise<boolean>;
}
