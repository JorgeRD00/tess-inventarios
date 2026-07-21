<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Nueva Compra</h1>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-1">Folio *</label>
          <input v-model="form.folio" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Proveedor *</label>
          <select v-model="form.supplierId" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Observaciones</label>
          <input v-model="form.observations" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
      </div>

      <h2 class="text-lg font-semibold mb-3">Productos</h2>
      <div class="mb-4 flex gap-2 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Producto</label>
          <select v-model="selectedProductId" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option value="">Seleccionar producto</option>
            <option v-for="prod in productStore.products" :key="prod.id" :value="prod.id">{{ prod.name }} - {{ prod.internalCode }}</option>
          </select>
        </div>
        <div class="w-24">
          <label class="block text-sm font-medium mb-1">Cantidad</label>
          <input v-model.number="itemQuantity" type="number" min="1" placeholder="Cantidad" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div class="w-32">
          <label class="block text-sm font-medium mb-1">Costo unitario</label>
          <input v-model.number="itemCost" type="number" min="0" step="0.01" placeholder="Costo" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <button type="button" @click="addItem" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Agregar</button>
      </div>

      <div v-if="form.items.length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <table class="w-full text-left">
          <thead>
            <tr>
              <th class="px-2 py-2">Producto</th>
              <th class="px-2 py-2">Cantidad</th>
              <th class="px-2 py-2">Costo</th>
              <th class="px-2 py-2">Subtotal</th>
              <th class="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-600">
            <tr v-for="(item, index) in form.items" :key="index">
              <td class="px-2 py-2">{{ productName(item.productId) }}</td>
              <td class="px-2 py-2">{{ item.quantity }}</td>
              <td class="px-2 py-2">{{ formatCurrency(item.unitCost) }}</td>
              <td class="px-2 py-2">{{ formatCurrency(item.subtotal) }}</td>
              <td class="px-2 py-2 text-right">
                <button type="button" @click="removeItem(index)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Quitar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span>IVA (16%)</span>
          <span>{{ formatCurrency(tax) }}</span>
        </div>
        <div class="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
          <span>Total</span>
          <span>{{ formatCurrency(total) }}</span>
        </div>
      </div>

      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar compra</button>
        <router-link to="/purchases" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</router-link>
      </div>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchases } from '@composables/usePurchases'
import { useProductStore } from '@stores/product.store'
import { useSuppliers } from '@composables/useSuppliers'
import { useUserStore } from '@stores/user.store'
import type { PurchaseItemCreate } from '@/types/purchase.types'
import type { Product } from '@/types/product.types'

const router = useRouter()
const { createPurchase } = usePurchases()
const productStore = useProductStore()
const { suppliers, loadSuppliers } = useSuppliers()
const userStore = useUserStore()

const error = ref('')
const selectedProductId = ref('')
const itemQuantity = ref(1)
const itemCost = ref(0)

interface FormItem extends PurchaseItemCreate {
  subtotal: number
}

const form = ref({
  folio: '',
  supplierId: '',
  observations: '',
  userId: '',
  items: [] as FormItem[],
})

const subtotal = computed(() => form.value.items.reduce((sum, item) => sum + item.subtotal, 0))
const tax = computed(() => subtotal.value * 0.16)
const total = computed(() => subtotal.value + tax.value)

onMounted(() => {
  productStore.loadProducts()
  loadSuppliers()
  form.value.userId = userStore.currentUser?.id || ''
})

watch(selectedProductId, (id) => {
  if (!id) {
    itemCost.value = 0
    return
  }
  const product = productStore.products.find((p: Product) => p.id === id)
  if (product) {
    itemCost.value = product.purchasePrice
  }
})

function productName(id: string) {
  return productStore.products.find((p: Product) => p.id === id)?.name || id
}

function addItem() {
  if (!selectedProductId.value || itemQuantity.value <= 0) return
  const cost = itemCost.value
  form.value.items.push({
    productId: selectedProductId.value,
    quantity: itemQuantity.value,
    unitCost: cost,
    subtotal: itemQuantity.value * cost,
  } as FormItem)
  selectedProductId.value = ''
  itemQuantity.value = 1
  itemCost.value = 0
}

function removeItem(index: number) {
  form.value.items.splice(index, 1)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)
}

async function handleSubmit() {
  error.value = ''
  if (form.value.items.length === 0) {
    error.value = 'Agrega al menos un producto'
    return
  }
  try {
    const payload = {
      ...form.value,
      items: form.value.items.map(({ productId, quantity, unitCost }) => ({ productId, quantity, unitCost }))
    }
    await createPurchase(payload)
    await productStore.loadProducts()
    router.push('/purchases')
  } catch (err: any) {
    error.value = err.message || 'Error al guardar'
  }
}
</script>
