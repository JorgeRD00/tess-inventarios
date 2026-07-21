<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">{{ isEdit ? 'Editar Marca' : 'Nueva Marca' }}</h1>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nombre *</label>
          <input v-model="form.name" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Sitio web</label>
          <input v-model="form.website" type="url" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Descripción</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
        </div>
      </div>
      <div class="mb-4">
        <label class="inline-flex items-center gap-2">
          <input v-model="form.active" type="checkbox" class="rounded" />
          <span>Activo</span>
        </label>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
        <router-link to="/brands" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</router-link>
      </div>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategories } from '@composables/useCategories'

const route = useRoute()
const router = useRouter()
const { createBrand, updateBrand, loadBrandById } = useCategories()

const isEdit = computed(() => !!route.params.id)
const brandId = computed(() => route.params.id as string)
const error = ref('')

const form = ref({
  name: '',
  description: '',
  website: '',
  active: true,
})

onMounted(async () => {
  if (isEdit.value) {
    const brand = await loadBrandById(brandId.value)
    Object.assign(form.value, brand)
  }
})

async function handleSubmit() {
  error.value = ''
  try {
    if (isEdit.value) {
      await updateBrand({ id: brandId.value, ...form.value })
    } else {
      await createBrand(form.value)
    }
    router.push('/brands')
  } catch (err: any) {
    error.value = err.message || 'Error al guardar'
  }
}
</script>
