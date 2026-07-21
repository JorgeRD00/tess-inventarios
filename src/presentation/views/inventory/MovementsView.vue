<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Movimientos de Inventario</h1>

    <div v-if="loading" class="text-center py-10">Cargando...</div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Aquí se mostrará el historial completo de entradas y salidas de inventario.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total de productos</p>
          <p class="text-2xl font-bold">{{ productCount }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400">Compras registradas</p>
          <p class="text-2xl font-bold">{{ purchaseCount }}</p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400">Ventas registradas</p>
          <p class="text-2xl font-bold">{{ saleCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@stores/product.store'
import { usePurchaseStore } from '@stores/purchase.store'
import { useSaleStore } from '@stores/sale.store'

const productStore = useProductStore()
const purchaseStore = usePurchaseStore()
const saleStore = useSaleStore()

const loading = computed(() => productStore.loading || purchaseStore.loading || saleStore.loading)
const productCount = computed(() => productStore.productCount)
const purchaseCount = computed(() => purchaseStore.purchaseCount)
const saleCount = computed(() => saleStore.saleCount)

onMounted(() => {
  productStore.loadProducts()
  purchaseStore.loadPurchases()
  saleStore.loadSales()
})
</script>
