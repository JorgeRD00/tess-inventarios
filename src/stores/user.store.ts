import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import UserApiService from '@services/user.api';
import type { User, UserCreate, UserUpdate, UserChangePassword, Login } from '../types/user.types';
import type { Role, Permission } from '../types/user.types';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const currentUserAvatar = ref<string | null>(null);
  const roles = ref<Role[]>([]);
  const permissions = ref<Permission[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeUsers = computed(() => users.value.filter(u => u.active));
  const inactiveUsers = computed(() => users.value.filter(u => !u.active));
  const userCount = computed(() => users.value.length);
  const activeUserCount = computed(() => activeUsers.value.length);
  const isAuthenticated = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.roleName === 'ADMINISTRADOR');

  // Actions
  /**
   * Load all users
   */
  async function loadUsers(filters?: { active?: boolean; roleId?: string }) {
    loading.value = true;
    error.value = null;
    try {
      users.value = await UserApiService.getUsers(filters);
    } catch (err: any) {
      error.value = err.message || 'Error loading users';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load user by ID
   */
  async function loadUserById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const user = await UserApiService.getUserById(id);
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = user;
      } else {
        users.value.push(user);
      }
      return user;
    } catch (err: any) {
      error.value = err.message || 'Error loading user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new user
   */
  async function createUser(data: UserCreate) {
    loading.value = true;
    error.value = null;
    try {
      const user = await UserApiService.createUser(data);
      users.value.push(user);
      return user;
    } catch (err: any) {
      error.value = err.message || 'Error creating user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing user
   */
  async function updateUser(data: UserUpdate) {
    loading.value = true;
    error.value = null;
    try {
      const user = await UserApiService.updateUser(data);
      const index = users.value.findIndex(u => u.id === data.id);
      if (index !== -1) {
        users.value[index] = user;
      }
      return user;
    } catch (err: any) {
      error.value = err.message || 'Error updating user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a user
   */
  async function deleteUser(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await UserApiService.deleteUser(id);
      users.value = users.value.filter(u => u.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Error deleting user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Change user password
   */
  async function changePassword(data: UserChangePassword) {
    loading.value = true;
    error.value = null;
    try {
      if (!currentUser.value) {
        throw new Error('No hay sesión activa');
      }
      await UserApiService.changePassword({
        ...data,
        requesterId: currentUser.value.id,
        requesterRole: currentUser.value.roleName,
      });
    } catch (err: any) {
      error.value = err.message || 'Error changing password';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Login user
   */
  async function login(data: Login) {
    loading.value = true;
    error.value = null;
    try {
      const response = await UserApiService.login(data);
      currentUser.value = response.user;
      loadCurrentUserAvatar();
      // Store token and user for rehydration
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (response.user) {
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      return response;
    } catch (err: any) {
      error.value = err.message || 'Error logging in';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout user
   */
  function logout() {
    currentUser.value = null;
    currentUserAvatar.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  /**
   * Rehydrate current user from localStorage on startup
   */
  function rehydrateUser() {
    const stored = localStorage.getItem('auth_user');
    if (stored && !currentUser.value) {
      try {
        currentUser.value = JSON.parse(stored);
        loadCurrentUserAvatar();
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }

  /**
   * Load current user avatar from localStorage
   */
  function loadCurrentUserAvatar() {
    if (!currentUser.value) {
      currentUserAvatar.value = null;
      return;
    }
    const stored = localStorage.getItem(`avatar_${currentUser.value.id}`);
    currentUserAvatar.value = stored || null;
  }

  /**
   * Set current user avatar (base64 data URL) in state and localStorage
   */
  function setCurrentUserAvatar(dataUrl: string) {
    if (!currentUser.value) return;
    currentUserAvatar.value = dataUrl;
    localStorage.setItem(`avatar_${currentUser.value.id}`, dataUrl);
  }

  /**
   * Clear current user avatar from state and localStorage
   */
  function clearCurrentUserAvatar() {
    if (!currentUser.value) return;
    currentUserAvatar.value = null;
    localStorage.removeItem(`avatar_${currentUser.value.id}`);
  }

  /**
   * Load all roles
   */
  async function loadRoles() {
    loading.value = true;
    error.value = null;
    try {
      roles.value = await UserApiService.getRoles();
    } catch (err: any) {
      error.value = err.message || 'Error loading roles';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load all permissions
   */
  async function loadPermissions() {
    loading.value = true;
    error.value = null;
    try {
      permissions.value = await UserApiService.getPermissions();
    } catch (err: any) {
      error.value = err.message || 'Error loading permissions';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null;
  }

  return {
    // State
    users,
    currentUser,
    currentUserAvatar,
    roles,
    permissions,
    loading,
    error,
    // Getters
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
    rehydrateUser,
    setCurrentUserAvatar,
    clearCurrentUserAvatar,
    loadRoles,
    loadPermissions,
    clearError,
  };
});
