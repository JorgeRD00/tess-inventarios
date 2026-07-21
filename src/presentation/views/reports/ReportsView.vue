<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Reportes</h1>

    <div v-if="loading" class="text-center py-10">Cargando...</div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total en compras</p>
          <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(purchaseStore.totalPurchasesAmount) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total en ventas</p>
          <p class="text-2xl font-bold text-red-600">{{ formatCurrency(saleStore.totalSalesAmount) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Utilidad bruta</p>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(grossProfit) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Productos con stock bajo</p>
          <p class="text-2xl font-bold text-orange-600">{{ productStore.lowStockProducts.length }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <BarChart title="Top 10 productos más vendidos" :data="topProductsData" />
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <LineChart title="Ventas y compras diarias" :labels="dailyLabels" :series="dailySeries" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@stores/product.store'
import { usePurchaseStore } from '@stores/purchase.store'
import { useSaleStore } from '@stores/sale.store'
import BarChart from '@presentation/components/charts/BarChart.vue'
import LineChart from '@presentation/components/charts/LineChart.vue'

const productStore = useProductStore()
const purchaseStore = usePurchaseStore()
const saleStore = useSaleStore()

const loading = computed(() => productStore.loading || purchaseStore.loading || saleStore.loading)
const grossProfit = computed(() => saleStore.totalSalesAmount - purchaseStore.totalPurchasesAmount)

const topProductsData = computed(() => {
  const nameById = new Map(productStore.products.map(p => [p.id, p.name]))
  const totals = new Map<string, { name: string; quantity: number }>()

  saleStore.sales.forEach(sale => {
    sale.items.forEach(item => {
      const productId = item.productId
      const existing = totals.get(productId)
      const name = existing?.name
        || nameById.get(productId)
        || item.product?.name
        || `Producto ${productId.slice(0, 4)}`

      totals.set(productId, {
        name,
        quantity: (existing?.quantity || 0) + item.quantity
      })
    })
  })

  return [...totals.values()]
    .map(({ name, quantity }) => ({ label: name, value: quantity }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
})

const dailyData = computed(() => {
  const map = new Map<string, { sales: number; purchases: number }>()
  const add = (date: string, key: 'sales' | 'purchases', total: number) => {
    const day = date.split('T')[0]
    const entry = map.get(day) || { sales: 0, purchases: 0 }
    entry[key] += total
    map.set(day, entry)
  }

  saleStore.sales.forEach(sale => add(sale.date, 'sales', sale.total || 0))
  purchaseStore.purchases.forEach(purchase => add(purchase.date, 'purchases', purchase.total || 0))

  if (map.size === 0) return []

  const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const [y, m, d] = sorted[sorted.length - 1][0].split('-').map(Number)
  const lastDay = new Date(y, (m || 1) - 1, d || 1)

  const days: { date: string; sales: number; purchases: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const current = new Date(lastDay)
    current.setDate(lastDay.getDate() - i)
    const iso = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
    const values = map.get(iso) || { sales: 0, purchases: 0 }
    days.push({ date: iso, ...values })
  }
  return days
})

const dailyLabels = computed(() => dailyData.value.map(d => formatShortDate(d.date)))

const dailySeries = computed(() => [
  { name: 'Ventas', data: dailyData.value.map(d => d.sales) },
  { name: 'Compras', data: dailyData.value.map(d => d.purchases) },
])

onMounted(() => {
  productStore.loadProducts()
  purchaseStore.loadPurchases()
  saleStore.loadSales()
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}

function formatShortDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, d || 1)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}
</script>
