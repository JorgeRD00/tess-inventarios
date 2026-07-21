<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Configuración</h1>

    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex gap-6">
        <button
          @click="activeTab = 'appearance'"
          class="pb-2 px-1 border-b-2 transition-colors"
          :class="activeTab === 'appearance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Apariencia
        </button>
        <button
          @click="activeTab = 'users'"
          class="pb-2 px-1 border-b-2 transition-colors"
          :class="activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Usuarios
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'appearance'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
      <h2 class="text-lg font-semibold mb-4">Apariencia</h2>
      <button
        @click="uiStore.toggleTheme"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Cambiar a modo {{ uiStore.isDark ? 'claro' : 'oscuro' }}
      </button>

      <h2 class="text-lg font-semibold mt-8 mb-4">Color principal</h2>
      <div class="flex items-center gap-4 mb-4">
        <input
          type="color"
          :value="uiStore.primaryColor"
          @input="handleColorInput"
          class="h-10 w-20 p-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
        />
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ uiStore.primaryColor }}</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="color in presetColors"
          :key="color"
          @click="uiStore.setPrimaryColor(color)"
          class="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
          :style="{ backgroundColor: color }"
          :class="{ 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800': uiStore.primaryColor === color }"
          :aria-label="`Color ${color}`"
        />
      </div>
      <button
        @click="uiStore.resetPrimaryColor"
        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Restaurar color predeterminado
      </button>

      <h2 class="text-lg font-semibold mt-8 mb-4">Logo del sistema</h2>
      <div class="flex items-center gap-4 mb-4">
        <img :src="uiStore.logo" alt="Logo actual" class="h-16 w-auto object-contain border rounded-lg p-1 dark:border-gray-600" />
      </div>
      <input
        ref="logoInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleLogoChange"
      />
      <div class="flex gap-3">
        <button
          @click="logoInput?.click()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Cambiar logo
        </button>
        <button
          @click="resetLogo"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Restaurar predeterminado
        </button>
      </div>

      <h2 class="text-lg font-semibold mt-8 mb-4">Acerca de</h2>
      <p class="text-gray-600 dark:text-gray-400">TESS Inventario v1.0.0</p>
      <p class="text-gray-500 dark:text-gray-500 text-sm">Sistema profesional de inventario.</p>
    </div>

    <div v-else>
      <h2 class="text-lg font-semibold mb-4">Gestión de usuarios</h2>

      <div v-if="loading" class="text-center py-10">Cargando...</div>
      <div v-else-if="error" class="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{{ error }}</div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="font-semibold mb-4">{{ isEditing ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre completo *</label>
              <input v-model="form.name" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Usuario *</label>
              <input v-model="form.username" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div v-if="!isEditing">
              <label class="block text-sm font-medium mb-1">Contraseña *</label>
              <input v-model="form.password" type="password" required minlength="8" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              <p class="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Rol *</label>
              <select v-model="form.roleId" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <option value="">Seleccionar rol</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input id="active" v-model="form.active" type="checkbox" class="rounded" />
              <label for="active" class="text-sm font-medium">Activo</label>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
              <button v-if="isEditing" type="button" @click="resetForm" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</button>
            </div>
          </form>
          <p v-if="formError" class="mt-4 text-red-500">{{ formError }}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3">Usuario</th>
                <th class="px-4 py-3">Rol</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-4 py-3">{{ user.name }}</td>
                <td class="px-4 py-3">{{ user.username }}</td>
                <td class="px-4 py-3">{{ user.roleName }}</td>
                <td class="px-4 py-3">{{ user.active ? 'Activo' : 'Inactivo' }}</td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button @click="editUser(user)" class="text-blue-600 hover:underline">Editar</button>
                  <button @click="openPasswordModal(user)" class="text-gray-600 hover:underline">Contraseña</button>
                  <button @click="deleteUser(user.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
        <h3 class="font-semibold mb-2">Cambiar contraseña</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Usuario: <strong>{{ selectedUserForPassword?.username }}</strong></p>
        <form @submit.prevent="handlePasswordSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nueva contraseña *</label>
            <input v-model="passwordForm.newPassword" type="password" required minlength="8" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <p class="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Confirmar nueva contraseña *</label>
            <input v-model="passwordForm.confirmPassword" type="password" required minlength="8" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
          <div class="flex gap-3">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
            <button type="button" @click="closePasswordModal" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUiStore } from '@stores/ui.store'
import { useUserStore } from '@stores/user.store'
import { useUsers } from '@composables/useUsers'
import type { User, UserCreate, UserUpdate } from '@/types/user.types'

const uiStore = useUiStore()
const userStore = useUserStore()
const { users, loading, error, loadUsers, createUser, updateUser, deleteUser, changePassword } = useUsers()

const activeTab = ref<'appearance' | 'users'>('appearance')
const roles = computed(() => userStore.roles)
const formError = ref('')
const editingId = ref<string | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)

const presetColors = [
  '#2563eb', '#ef4444', '#22c55e', '#eab308', '#a855f7',
  '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#06b6d4'
]

const showPasswordModal = ref(false)
const selectedUserForPassword = ref<User | null>(null)
const passwordForm = ref({ newPassword: '', confirmPassword: '' })
const passwordError = ref('')

const isEditing = computed(() => !!editingId.value)

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  roleId: '',
  active: true,
})

function handleColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  uiStore.setPrimaryColor(target.value)
}

function resetForm() {
  editingId.value = null
  form.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    roleId: '',
    active: true,
  }
  formError.value = ''
}

function handleLogoChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      uiStore.setLogo(result)
    }
  }
  reader.readAsDataURL(file)
}

function resetLogo() {
  uiStore.resetLogo()
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

function editUser(user: User) {
  editingId.value = user.id
  form.value = {
    name: user.name,
    username: user.username,
    email: user.email || '',
    password: '',
    roleId: user.roleId,
    active: user.active,
  }
}

async function handleSubmit() {
  formError.value = ''
  try {
    if (isEditing.value) {
      const data: UserUpdate = {
        id: editingId.value!,
        name: form.value.name,
        username: form.value.username,
        email: form.value.email || undefined,
        roleId: form.value.roleId,
        active: form.value.active,
      }
      await updateUser(data)
    } else {
      const data: UserCreate = {
        name: form.value.name,
        username: form.value.username,
        email: form.value.email || undefined,
        password: form.value.password,
        roleId: form.value.roleId,
      }
      await createUser(data)
    }
    resetForm()
  } catch (err: any) {
    formError.value = err.message || 'Error al guardar usuario'
  }
}

function openPasswordModal(user: User) {
  selectedUserForPassword.value = user
  passwordForm.value = { newPassword: '', confirmPassword: '' }
  passwordError.value = ''
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordError.value = ''
  selectedUserForPassword.value = null
}

async function handlePasswordSubmit() {
  passwordError.value = ''
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }
  if (!selectedUserForPassword.value) return
  try {
    await changePassword({
      id: selectedUserForPassword.value.id,
      newPassword: passwordForm.value.newPassword,
    })
    closePasswordModal()
  } catch (err: any) {
    passwordError.value = err.message || 'Error al cambiar contraseña'
  }
}

onMounted(() => {
  loadUsers()
  userStore.loadRoles()
})
</script>
