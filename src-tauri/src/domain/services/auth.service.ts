import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import { BusinessError } from '@shared/errors/custom-error';

/**
 * Domain service for authentication operations
 * Contains business logic related to authentication
 */
export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Authenticate a user with username and password
   */
  async authenticate(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) {
      throw new BusinessError('Invalid credentials');
    }

    if (!user.active) {
      throw new BusinessError('User account is inactive');
    }

    // Password verification should be done with bcrypt in application layer
    // This domain service only validates business rules
    
    return user;
  }

  /**
   * Validate if a user has a specific permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return false;
    }

    return user.hasPermission(permission);
  }

  /**
   * Validate if a user has any of the specified permissions
   */
  async hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return false;
    }

    if (!user.role) {
      return false;
    }

    return user.role.hasAnyPermissions(permissions);
  }

  /**
   * Validate if a user has all of the specified permissions
   */
  async hasAllPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return false;
    }

    if (!user.role) {
      return false;
    }

    return user.role.hasAllPermissions(permissions);
  }

  /**
   * Check if username is available for new user
   */
  async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    const existingUser = await this.userRepository.findByUsername(username);
    
    if (!existingUser) {
      return true;
    }

    // If excluding a user ID, allow if the existing user is the same
    if (excludeUserId && existingUser.id === excludeUserId) {
      return true;
    }

    return false;
  }

  /**
   * Check if email is available for new user
   */
  async isEmailAvailable(email: string, excludeUserId?: string): Promise<boolean> {
    if (!email) {
      return true; // Email is optional
    }

    const existingUser = await this.userRepository.findByEmail(email);
    
    if (!existingUser) {
      return true;
    }

    // If excluding a user ID, allow if the existing user is the same
    if (excludeUserId && existingUser.id === excludeUserId) {
      return true;
    }

    return false;
  }
}
