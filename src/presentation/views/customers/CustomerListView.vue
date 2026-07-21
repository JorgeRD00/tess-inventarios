<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/customers/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nuevo cliente
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar cliente..."
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
            <th class="px-4 py-3">Teléfono</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">RFC</th>
            <th class="px-4 py-3">Dirección</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3">{{ customer.name }}</td>
            <td class="px-4 py-3">{{ customer.phone || '-' }}</td>
            <td class="px-4 py-3">{{ customer.email || '-' }}</td>
            <td class="px-4 py-3">{{ customer.taxId || '-' }}</td>
            <td class="px-4 py-3">{{ customer.address || '-' }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <router-link v-if="isAdmin" :to="`/customers/${customer.id}/edit`" class="text-blue-600 hover:underline">Editar</router-link>
              <button v-if="isAdmin" @click="deleteCustomer(customer.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCustomers } from '@composables/useCustomers'
import { useUserStore } from '@stores/user.store'
import { exportToExcel as doExportToExcel, type ExcelColumn } from '@utils/exportToExcel'
import type { Customer } from '@/types/customer.types'

const { customers, loading, error, loadCustomers, deleteCustomer } = useCustomers()
const userStore = useUserStore()
const searchQuery = ref('')
const isAdmin = computed(() => userStore.isAdmin)

const columns: ExcelColumn<Customer>[] = [
  { label: 'Nombre', value: c => c.name },
  { label: 'Teléfono', value: c => c.phone || '-' },
  { label: 'Email', value: c => c.email || '-' },
  { label: 'RFC', value: c => c.taxId || '-' },
  { label: 'Dirección', value: c => c.address || '-' },
]

function exportToExcel() {
  doExportToExcel('Clientes', columns, filteredCustomers.value)
}

onMounted(() => {
  loadCustomers()
})

const filteredCustomers = computed<Customer[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return customers.value
  return customers.value.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(q) ||
    (customer.phone || '').toLowerCase().includes(q) ||
    (customer.email || '').toLowerCase().includes(q) ||
    (customer.taxId || '').toLowerCase().includes(q) ||
    (customer.address || '').toLowerCase().includes(q)
  )
})
</script>
