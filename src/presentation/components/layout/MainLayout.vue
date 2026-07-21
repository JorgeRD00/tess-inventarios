<template>
  <div class="min-h-screen flex" :class="{ 'dark': uiStore.isDark }">
    <!-- Sidebar -->
    <aside
      class="text-white transition-all duration-300 flex flex-col"
      :class="uiStore.sidebarOpen ? 'w-64' : 'w-16'"
      style="background-color: var(--color-primary-900);"
    >
      <div
        class="h-16 flex items-center justify-center border-b"
        style="border-color: var(--color-primary-800);"
      >
        <img
          v-if="uiStore.sidebarOpen"
          :src="uiStore.logo"
          alt="Logo"
          class="h-10 w-auto object-contain"
        />
        <img
          v-else
          :src="uiStore.logo"
          alt="Logo"
          class="h-8 w-auto object-contain"
        />
      </div>

      <nav class="flex-1 py-4 px-2 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-blue-800"
          :class="{ 'bg-blue-600': isActive(item.path) }"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span v-if="uiStore.sidebarOpen">{{ item.name }}</span>
        </router-link>
      </nav>

      <div
        class="p-2 border-t space-y-1"
        style="border-color: var(--color-primary-800);"
      >
        <button
          @click="uiStore.toggleTheme"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-primary-800)] transition-colors"
        >
          <span class="text-lg">{{ uiStore.isDark ? '☀️' : '🌙' }}</span>
          <span v-if="uiStore.sidebarOpen">{{ uiStore.isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
        </button>
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900 transition-colors text-left"
        >
          <span class="text-lg">🚪</span>
          <span v-if="uiStore.sidebarOpen">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div
      class="flex-1 flex flex-col min-w-0 dark:text-white"
      style="background-color: var(--color-primary-50);"
      :style="{ backgroundColor: uiStore.isDark ? 'var(--color-primary-950)' : 'var(--color-primary-50)' }"
    >
      <header
        class="h-16 border-b flex items-center px-4 shadow-sm"
        :class="uiStore.isDark ? 'bg-[var(--color-primary-900)] border-[var(--color-primary-800)]' : 'bg-[var(--color-primary-100)] border-[var(--color-primary-200)]'"
      >
        <button
          @click="uiStore.toggleSidebar"
          class="p-2 rounded-lg transition-colors"
          :class="uiStore.isDark ? 'hover:bg-[var(--color-primary-800)]' : 'hover:bg-[var(--color-primary-200)]'"
        >
          ☰
        </button>
        <h1 class="ml-4 text-lg font-semibold" style="color: var(--color-primary-700);">{{ pageTitle }}</h1>

        <router-link
          v-if="userStore.currentUser"
          to="/profile"
          class="ml-auto flex items-center gap-2 rounded-lg px-2 py-1 transition-colors"
          :class="uiStore.isDark ? 'hover:bg-[var(--color-primary-800)]' : 'hover:bg-[var(--color-primary-200)]'"
        >
          <span class="text-sm hidden sm:inline">{{ userStore.currentUser.name }}</span>
          <img
            :src="avatarSrc"
            alt="Foto de perfil"
            class="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
        </router-link>
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@stores/ui.store'
import { useUserStore } from '@stores/user.store'

const uiStore = useUiStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const avatarSrc = computed(() => userStore.currentUserAvatar || '/avatars/default-avatar.svg')

function logout() {
  userStore.logout()
  router.push('/login')
}

const allMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊', adminOnly: true },
  { name: 'Inventario', path: '/inventory', icon: '📦', adminOnly: true },
  { name: 'Categorías', path: '/categories', icon: '📁', adminOnly: true },
  { name: 'Marcas', path: '/brands', icon: '🏷️', adminOnly: true },
  { name: 'Compras', path: '/purchases', icon: '🛒' },
  { name: 'Ventas', path: '/sales', icon: '💰' },
  { name: 'Clientes', path: '/customers', icon: '👥' },
  { name: 'Proveedores', path: '/suppliers', icon: '🏭', adminOnly: true },
  { name: 'Reportes', path: '/reports', icon: '📈', adminOnly: true },
  { name: 'Configuración', path: '/settings', icon: '⚙️', adminOnly: true },
  { name: 'Mi perfil', path: '/profile', icon: '👤' },
]

const menuItems = computed(() => allMenuItems.filter(item => item.adminOnly ? userStore.isAdmin : true))

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

const pageTitle = computed(() => {
  const item = menuItems.value.find((i) => route.path.startsWith(i.path))
  return item?.name || 'TESS Inventario'
})
</script>
