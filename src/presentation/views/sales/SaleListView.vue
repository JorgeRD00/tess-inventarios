<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Ventas</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/sales/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nueva venta
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar venta por folio, cliente o total..."
        class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
      />
    </div>

    <div v-if="loading" class="text-center py-10">Cargando...</div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{{ error }}</div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3">Folio</th>
            <th class="px-4 py-3">Cliente</th>
            <th class="px-4 py-3">Usuario</th>
            <th class="px-4 py-3">Fecha</th>
            <th class="px-4 py-3">Subtotal</th>
            <th class="px-4 py-3">Descuento</th>
            <th class="px-4 py-3">IVA</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3 font-mono text-sm">{{ sale.folio }}</td>
            <td class="px-4 py-3">{{ sale.customer?.name || 'Mostrador' }}</td>
            <td class="px-4 py-3">{{ sale.user?.name || '-' }}</td>
            <td class="px-4 py-3">{{ formatDate(sale.date) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(sale.subtotal) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(sale.discount) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(sale.tax) }}</td>
            <td class="px-4 py-3 font-semibold">{{ formatCurrency(sale.total) }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button v-if="isAdmin" @click="removeSale(sale.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSales } from '@composables/useSales'
import { useProductStore } from '@stores/product.store'
import { useUserStore } from '@stores/user.store'
import { exportToExcel as doExportToExcel, type ExcelColumn } from '@utils/exportToExcel'
import type { Sale } from '@/types/sale.types'

const { sales, loading, error, loadSales, deleteSale } = useSales()
const productStore = useProductStore()
const userStore = useUserStore()
const searchQuery = ref('')
const isAdmin = computed(() => userStore.isAdmin)

const columns: ExcelColumn<Sale>[] = [
  { label: 'Folio', value: s => s.folio },
  { label: 'Cliente', value: s => s.customer?.name || 'Mostrador' },
  { label: 'Usuario', value: s => s.user?.name || '-' },
  { label: 'Fecha', value: s => formatDate(s.date) },
  { label: 'Subtotal', value: s => formatCurrency(s.subtotal) },
  { label: 'Descuento', value: s => formatCurrency(s.discount) },
  { label: 'IVA', value: s => formatCurrency(s.tax) },
  { label: 'Total', value: s => formatCurrency(s.total) },
]

function exportToExcel() {
  doExportToExcel('Ventas', columns, filteredSales.value)
}

async function removeSale(id: string) {
  await deleteSale(id)
  await productStore.loadProducts()
}

onMounted(() => {
  loadSales()
})

const filteredSales = computed<Sale[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return sales.value
  return sales.value.filter((sale: Sale) =>
    sale.folio.toLowerCase().includes(q) ||
    (sale.customer?.name || 'mostrador').toLowerCase().includes(q) ||
    (sale.user?.name || '').toLowerCase().includes(q) ||
    String(sale.total).includes(q) ||
    formatDate(sale.date).toLowerCase().includes(q)
  )
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-MX')
}
</script>
