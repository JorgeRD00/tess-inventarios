<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <div v-if="loading" class="text-center py-10">
      Cargando...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-bold">
      <StatCard title="Productos" :value="productStore.productCount" icon="📦" color="blue" />
      <StatCard title="Clientes" :value="customerStore.customerCount" icon="👥" color="green" />
      <StatCard title="Proveedores" :value="supplierStore.supplierCount" icon="🏭" color="yellow" />
      <StatCard title="Compras" :value="purchaseStore.purchaseCount" icon="🛒" color="purple" />
      <StatCard title="Ventas" :value="saleStore.saleCount" icon="💰" color="red" />
      <StatCard title="Stock Bajo" :value="productStore.lowStockProducts.length" icon="⚠️" color="orange" />
      <StatCard title="Total Compras" :value="formatCurrency(purchaseStore.totalPurchasesAmount)" icon="💵" color="indigo" />
      <StatCard title="Total Ventas" :value="formatCurrency(saleStore.totalSalesAmount)" icon="💸" color="pink" />
    </div>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg  mb-4 font-bold">Productos con stock bajo</h2>
        <ul v-if="productStore.lowStockProducts.length > 0" class="divide-y dark:divide-gray-700">
          <li v-for="product in productStore.lowStockProducts" :key="product.id" class="py-2 flex justify-between">
            <span>{{ product.name }}</span>
            <span class="font-mono text-red-500">{{ product.stock }} / {{ product.minStock }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-500 dark:text-gray-400">No hay productos con stock bajo.</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg  mb-4 font-bold">Accesos rápidos</h2>
        <div class="grid grid-cols-2 gap-3">
          <router-link to="/inventory/new" class="quick-access p-3 rounded-lg text-center">
            Nuevo producto
          </router-link>
          <router-link to="/purchases/new" class="quick-access p-3 rounded-lg text-center">
            Nueva compra
          </router-link>
          <router-link to="/sales/new" class="quick-access p-3 rounded-lg text-center">
            Nueva venta
          </router-link>
          <router-link to="/suppliers" class="quick-access p-3 rounded-lg text-center">
            Proveedores
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '@stores/product.store'
import { useCustomerStore } from '@stores/customer.store'
import { useSupplierStore } from '@stores/supplier.store'
import { usePurchaseStore } from '@stores/purchase.store'
import { useSaleStore } from '@stores/sale.store'
import StatCard from '@presentation/components/common/StatCard.vue'

const productStore = useProductStore()
const customerStore = useCustomerStore()
const supplierStore = useSupplierStore()
const purchaseStore = usePurchaseStore()
const saleStore = useSaleStore()

const loading = ref(true)

onMounted(async () => {
  await Promise.all([
    productStore.loadProducts(),
    customerStore.loadCustomers(),
    supplierStore.loadSuppliers(),
    purchaseStore.loadPurchases(),
    saleStore.loadSales(),
  ])
  loading.value = false
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}
</script>
