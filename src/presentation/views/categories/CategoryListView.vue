<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categorías</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/categories/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nueva categoría
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar categoría..."
        class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
      />
    </div>

    <div v-if="loading" class="text-center py-10">Cargando...</div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{{ error }}</div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3">Nombre</th>
            <th class="px-4 py-3">Descripción</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="category in filteredCategories" :key="category.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3">{{ category.name }}</td>
            <td class="px-4 py-3">{{ category.description || '-' }}</td>
            <td class="px-4 py-3">
              <span :class="category.active ? 'text-green-600' : 'text-gray-500'">
                {{ category.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <router-link :to="`/categories/${category.id}/edit`" class="text-blue-600 hover:underline">Editar</router-link>
              <button @click="deleteCategory(category.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCategories } from '@composables/useCategories'
import { exportToExcel as doExportToExcel, type ExcelColumn } from '@utils/exportToExcel'
import type { Category } from '@/types/category.types'

const { categories, loading, error, loadCategories, deleteCategory } = useCategories()
const searchQuery = ref('')

const columns: ExcelColumn<Category>[] = [
  { label: 'Nombre', value: c => c.name },
  { label: 'Descripción', value: c => c.description || '-' },
  { label: 'Estado', value: c => c.active ? 'Activo' : 'Inactivo' },
]

function exportToExcel() {
  doExportToExcel('Categorias', columns, filteredCategories.value)
}

onMounted(() => {
  loadCategories()
})

const filteredCategories = computed<Category[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value.filter((category: Category) =>
    category.name.toLowerCase().includes(q) ||
    (category.description || '').toLowerCase().includes(q)
  )
})
</script>
