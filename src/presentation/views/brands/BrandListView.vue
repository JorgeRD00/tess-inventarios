<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Marcas</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/brands/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nueva marca
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar marca..."
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
            <th class="px-4 py-3">Sitio web</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="brand in filteredBrands" :key="brand.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3">{{ brand.name }}</td>
            <td class="px-4 py-3">{{ brand.description || '-' }}</td>
            <td class="px-4 py-3">
              <a v-if="brand.website" :href="brand.website" target="_blank" class="text-blue-600 hover:underline">{{ brand.website }}</a>
              <span v-else class="text-gray-500">-</span>
            </td>
            <td class="px-4 py-3">
              <span :class="brand.active ? 'text-green-600' : 'text-gray-500'">
                {{ brand.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <router-link :to="`/brands/${brand.id}/edit`" class="text-blue-600 hover:underline">Editar</router-link>
              <button @click="deleteBrand(brand.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
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
import type { Brand } from '@/types/category.types'

const { brands, loading, error, loadBrands, deleteBrand } = useCategories()
const searchQuery = ref('')

const columns: ExcelColumn<Brand>[] = [
  { label: 'Nombre', value: b => b.name },
  { label: 'Descripción', value: b => b.description || '-' },
  { label: 'Sitio web', value: b => b.website || '-' },
  { label: 'Estado', value: b => b.active ? 'Activo' : 'Inactivo' },
]

function exportToExcel() {
  doExportToExcel('Marcas', columns, filteredBrands.value)
}

onMounted(() => {
  loadBrands()
})

const filteredBrands = computed<Brand[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return brands.value
  return brands.value.filter((brand: Brand) =>
    brand.name.toLowerCase().includes(q) ||
    (brand.description || '').toLowerCase().includes(q) ||
    (brand.website || '').toLowerCase().includes(q)
  )
})
</script>
