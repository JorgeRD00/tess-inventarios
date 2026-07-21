import { useUserStore } from '@stores/user.store';
import { storeToRefs } from 'pinia';
import type { UserCreate, UserUpdate, UserChangePassword, Login } from '../types/user.types';

/**
 * Composable for user operations
 * Provides a convenient interface for working with users
 */
export function useUsers() {
  const userStore = useUserStore();
  const { users, currentUser, currentUserAvatar, roles, permissions, loading, error, activeUsers, inactiveUsers, userCount, activeUserCount, isAuthenticated, isAdmin } = storeToRefs(userStore);

  /**
   * Load users with optional filters
   */
  const loadUsers = async (filters?: { active?: boolean; roleId?: string }) => {
    return await userStore.loadUsers(filters);
  };

  /**
   * Load a specific user by ID
   */
  const loadUserById = async (id: string) => {
    return await userStore.loadUserById(id);
  };

  /**
   * Create a new user
   */
  const createUser = async (data: UserCreate) => {
    return await userStore.createUser(data);
  };

  /**
   * Update an existing user
   */
  const updateUser = async (data: UserUpdate) => {
    return await userStore.updateUser(data);
  };

  /**
   * Delete a user
   */
  const deleteUser = async (id: string) => {
    return await userStore.deleteUser(id);
  };

  /**
   * Change user password
   */
  const changePassword = async (data: UserChangePassword) => {
    return await userStore.changePassword(data);
  };

  /**
   * Login user
   */
  const login = async (data: Login) => {
    return await userStore.login(data);
  };

  /**
   * Logout user
   */
  const logout = () => {
    userStore.logout();
  };

  return {
    // State & getters (refs)
    users,
    currentUser,
    currentUserAvatar,
    roles,
    permissions,
    loading,
    error,
    activeUsers,
    inactiveUsers,
    userCount,
    activeUserCount,
    isAuthenticated,
    isAdmin,
    // Actions
    loadUsers,
    loadUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    login,
    logout,
    setCurrentUserAvatar: userStore.setCurrentUserAvatar,
    clearCurrentUserAvatar: userStore.clearCurrentUserAvatar,
    clearError: userStore.clearError,
  };
}
