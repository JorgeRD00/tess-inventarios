<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Proveedores</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/suppliers/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nuevo proveedor
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar proveedor..."
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
            <th class="px-4 py-3">Contacto</th>
            <th class="px-4 py-3">Teléfono</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">RFC</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3">{{ supplier.name }}</td>
            <td class="px-4 py-3">{{ supplier.contactName || '-' }}</td>
            <td class="px-4 py-3">{{ supplier.phone || '-' }}</td>
            <td class="px-4 py-3">{{ supplier.email || '-' }}</td>
            <td class="px-4 py-3">{{ supplier.taxId || '-' }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <router-link :to="`/suppliers/${supplier.id}/edit`" class="text-blue-600 hover:underline">Editar</router-link>
              <button @click="deleteSupplier(supplier.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSuppliers } from '@composables/useSuppliers'
import { exportToExcel as doExportToExcel, type ExcelColumn } from '@utils/exportToExcel'
import type { Supplier } from '@/types/supplier.types'

const { suppliers, loading, error, loadSuppliers, deleteSupplier } = useSuppliers()
const searchQuery = ref('')

const columns: ExcelColumn<Supplier>[] = [
  { label: 'Nombre', value: s => s.name },
  { label: 'Contacto', value: s => s.contactName || '-' },
  { label: 'Teléfono', value: s => s.phone || '-' },
  { label: 'Email', value: s => s.email || '-' },
  { label: 'RFC', value: s => s.taxId || '-' },
]

function exportToExcel() {
  doExportToExcel('Proveedores', columns, filteredSuppliers.value)
}

onMounted(() => {
  loadSuppliers()
})

const filteredSuppliers = computed<Supplier[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return suppliers.value
  return suppliers.value.filter((supplier: Supplier) =>
    supplier.name.toLowerCase().includes(q) ||
    (supplier.contactName || '').toLowerCase().includes(q) ||
    (supplier.phone || '').toLowerCase().includes(q) ||
    (supplier.email || '').toLowerCase().includes(q) ||
    (supplier.taxId || '').toLowerCase().includes(q) ||
    (supplier.address || '').toLowerCase().includes(q)
  )
})
</script>
