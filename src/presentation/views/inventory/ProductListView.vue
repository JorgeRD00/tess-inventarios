<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Inventario</h1>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Exportar Excel
        </button>
        <router-link to="/inventory/new" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nuevo producto
        </router-link>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar producto..."
        class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
      />
    </div>

    <div v-if="loading" class="text-center py-10">Cargando...</div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{{ error }}</div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3">Imagen</th>
            <th class="px-4 py-3">Código</th>
            <th class="px-4 py-3">Nombre</th>
            <th class="px-4 py-3">Stock</th>
            <th class="px-4 py-3">Precio venta</th>
            <th class="px-4 py-3">Categoría</th>
            <th class="px-4 py-3">Marca</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-3">
              <img
                v-if="product.images[0]?.path"
                :src="product.images[0].path"
                :alt="product.name"
                class="h-12 w-12 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <span v-else class="text-gray-400 text-sm">-</span>
            </td>
            <td class="px-4 py-3 font-mono text-sm">{{ product.internalCode }}</td>
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">
              <span :class="product.stock <= product.minStock ? 'text-red-500 font-semibold' : ''">
                {{ product.stock }}
              </span>
            </td>
            <td class="px-4 py-3">{{ formatCurrency(product.salePrice) }}</td>
            <td class="px-4 py-3">{{ product.category?.name || '-' }}</td>
            <td class="px-4 py-3">{{ product.brand?.name || '-' }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <router-link :to="`/inventory/${product.id}/edit`" class="text-blue-600 hover:underline">Editar</router-link>
              <button @click="deleteProduct(product.id)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProducts } from '@composables/useProducts'
import { exportToExcel as doExportToExcel, type ExcelColumn } from '@utils/exportToExcel'
import type { Product } from '@/types/product.types'

const { products, loading, error, loadProducts, deleteProduct } = useProducts()
const searchQuery = ref('')

const columns: ExcelColumn<Product>[] = [
  { label: 'Código', value: p => p.internalCode },
  { label: 'Nombre', value: p => p.name },
  { label: 'Stock', value: p => p.stock },
  { label: 'Precio venta', value: p => formatCurrency(p.salePrice) },
  { label: 'Categoría', value: p => p.category?.name || '-' },
  { label: 'Marca', value: p => p.brand?.name || '-' },
]

function exportToExcel() {
  doExportToExcel('Inventario', columns, filteredProducts.value)
}

onMounted(() => {
  loadProducts()
})

const filteredProducts = computed<Product[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter((product: Product) =>
    product.name.toLowerCase().includes(q) ||
    product.internalCode.toLowerCase().includes(q) ||
    (product.barcode && product.barcode.toLowerCase().includes(q)) ||
    (product.sku && product.sku.toLowerCase().includes(q)) ||
    (product.category?.name || '').toLowerCase().includes(q) ||
    (product.brand?.name || '').toLowerCase().includes(q)
  )
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}
</script>
