<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Mi perfil</h1>

    <div v-if="!currentUser" class="text-center py-10">Cargando perfil...</div>

    <div v-else class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Información del usuario</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Nombre:</span>
            <p class="font-medium">{{ currentUser.name }}</p>
          </div>
          <div>
            <span class="text-gray-500">Usuario:</span>
            <p class="font-medium">{{ currentUser.username }}</p>
          </div>
          <div>
            <span class="text-gray-500">Email:</span>
            <p class="font-medium">{{ currentUser.email || '-' }}</p>
          </div>
          <div>
            <span class="text-gray-500">Rol:</span>
            <p class="font-medium">{{ currentUser.roleName || '-' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Foto de perfil</h2>
        <div class="flex items-center gap-6">
          <img
            :src="avatarSrc"
            alt="Foto de perfil"
            class="h-24 w-24 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <div class="flex gap-3">
              <button
                @click="avatarInput?.click()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cambiar foto
              </button>
              <button
                @click="resetAvatar"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Restaurar predeterminada
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Cambiar contraseña</h2>
        <form @submit.prevent="handlePasswordSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Contraseña actual *</label>
            <input v-model="passwordForm.currentPassword" type="password" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
          </div>
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
          <p v-if="passwordSuccess" class="text-green-600 text-sm">{{ passwordSuccess }}</p>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Actualizar contraseña</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUsers } from '@composables/useUsers'

const { currentUser, currentUserAvatar, changePassword, setCurrentUserAvatar, clearCurrentUserAvatar } = useUsers()

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const passwordError = ref('')
const passwordSuccess = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)

const avatarSrc = computed(() => currentUserAvatar.value || '/avatars/default-avatar.svg')

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !currentUser.value) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      setCurrentUserAvatar(result)
    }
  }
  reader.readAsDataURL(file)
}

function resetAvatar() {
  clearCurrentUserAvatar()
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

async function handlePasswordSubmit() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!currentUser.value) {
    passwordError.value = 'No hay sesión activa'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    await changePassword({
      id: currentUser.value.id,
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    passwordSuccess.value = 'Contraseña actualizada correctamente'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err: any) {
    passwordError.value = err.message || 'Error al cambiar contraseña'
  }
}
</script>
