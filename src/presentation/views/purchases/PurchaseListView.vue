<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Compras</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/purchases/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nueva compra
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar compra por folio, proveedor o total..."
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
            <th class="px-4 py-3">Proveedor</th>
            <th class="px-4 py-3">Usuario</th>
            <th class="px-4 py-3">Fecha</th>
            <th class="px-4 py-3">Subtotal</th>
            <th class="px-4 py-3">IVA</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="purchase in filteredPurchases" :key="purchase.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3 font-mono text-sm">{{ purchase.folio }}</td>
            <td class="px-4 py-3">{{ purchase.supplier?.name || '-' }}</td>
            <td class="px-4 py-3">{{ purchase.user?.name || '-' }}</td>
            <td class="px-4 py-3">{{ formatDate(purchase.date) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(purchase.subtotal) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(purchase.tax) }}</td>
            <td class="px-4 py-3 font-semibold">{{ formatCurrency(purchase.total) }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button v-if="isAdmin" @click="removePurchase(purchase.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { usePurchases } from '@composables/usePurchases'
import { useProductStore } from '@stores/product.store'
import { useUserStore } from '@stores/user.store'
import { exportToExcel as doExportToExcel, type ExcelColumn } from '@utils/exportToExcel'
import type { Purchase } from '@/types/purchase.types'

const { purchases, loading, error, loadPurchases, deletePurchase } = usePurchases()
const productStore = useProductStore()
const userStore = useUserStore()
const searchQuery = ref('')
const isAdmin = computed(() => userStore.isAdmin)

const columns: ExcelColumn<Purchase>[] = [
  { label: 'Folio', value: p => p.folio },
  { label: 'Proveedor', value: p => p.supplier?.name || '-' },
  { label: 'Usuario', value: p => p.user?.name || '-' },
  { label: 'Fecha', value: p => formatDate(p.date) },
  { label: 'Subtotal', value: p => formatCurrency(p.subtotal) },
  { label: 'IVA', value: p => formatCurrency(p.tax) },
  { label: 'Total', value: p => formatCurrency(p.total) },
]

function exportToExcel() {
  doExportToExcel('Compras', columns, filteredPurchases.value)
}

async function removePurchase(id: string) {
  await deletePurchase(id)
  await productStore.loadProducts()
}

onMounted(() => {
  loadPurchases()
})

const filteredPurchases = computed<Purchase[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return purchases.value
  return purchases.value.filter((purchase: Purchase) =>
    purchase.folio.toLowerCase().includes(q) ||
    (purchase.supplier?.name || '').toLowerCase().includes(q) ||
    (purchase.user?.name || '').toLowerCase().includes(q) ||
    String(purchase.total).includes(q) ||
    formatDate(purchase.date).toLowerCase().includes(q)
  )
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-MX')
}
</script>
