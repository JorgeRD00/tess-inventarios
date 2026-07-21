<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Nueva Venta</h1>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-1">Folio *</label>
          <input v-model="form.folio" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Cliente</label>
          <select v-model="form.customerId" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option :value="undefined">Mostrador</option>
            <option v-for="cust in customers" :key="cust.id" :value="cust.id">{{ cust.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Método de pago *</label>
          <select v-model="form.paymentMethodId" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option value="">Seleccionar</option>
            <option v-for="pm in paymentMethods" :key="pm.id" :value="pm.id">{{ pm.name }}</option>
          </select>
        </div>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">Observaciones</label>
        <input v-model="form.observations" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
      </div>

      <h2 class="text-lg font-semibold mb-3">Productos</h2>
      <div class="mb-4 flex gap-2 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Producto</label>
          <select v-model="selectedProductId" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option value="">Seleccionar producto</option>
            <option v-for="prod in availableProducts" :key="prod.id" :value="prod.id">{{ prod.name }} - {{ prod.internalCode }} (Stock: {{ getProductRemainingStock(prod) }})</option>
          </select>
          <p v-if="selectedProduct" class="text-xs mt-1 text-gray-500 dark:text-gray-400">Disponible: {{ selectedProduct.stock - existingQuantity }}</p>
        </div>
        <div class="w-24">
          <label class="block text-sm font-medium mb-1">Cantidad</label>
          <input v-model.number="itemQuantity" type="number" min="1" :max="maxQuantity" step="1" placeholder="Cantidad" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div class="w-32">
          <label class="block text-sm font-medium mb-1">Precio</label>
          <input v-model.number="itemPrice" type="number" min="0" step="0.01" placeholder="Precio" readonly class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-600" />
        </div>
        <div class="w-24">
          <label class="block text-sm font-medium mb-1">Descuento</label>
          <input v-model.number="itemDiscount" type="number" min="0" step="0.01" placeholder="Desc" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <button type="button" @click="addItem" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Agregar</button>
      </div>

      <div v-if="form.items.length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <table class="w-full text-left">
          <thead>
            <tr>
              <th class="px-2 py-2">Producto</th>
              <th class="px-2 py-2">Cantidad</th>
              <th class="px-2 py-2">Precio</th>
              <th class="px-2 py-2">Descuento</th>
              <th class="px-2 py-2">Subtotal</th>
              <th class="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-600">
            <tr v-for="(item, index) in form.items" :key="index">
              <td class="px-2 py-2">{{ productName(item.productId) }}</td>
              <td class="px-2 py-2">{{ item.quantity }}</td>
              <td class="px-2 py-2">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="px-2 py-2">{{ formatCurrency(item.discount || 0) }}</td>
              <td class="px-2 py-2">{{ formatCurrency(item.subtotal) }}</td>
              <td class="px-2 py-2 text-right">
                <button type="button" @click="removeItem(index)" class="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Quitar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mb-4 max-w-xs">
        <label class="block text-sm font-medium mb-1">Descuento global</label>
        <input v-model.number="form.discount" type="number" min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
      </div>

      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Descuento</span>
          <span>{{ formatCurrency(form.discount || 0) }}</span>
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
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar venta</button>
        <router-link to="/sales" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</router-link>
      </div>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSales } from '@composables/useSales'
import { useProductStore } from '@stores/product.store'
import { useCustomers } from '@composables/useCustomers'
import { useUserStore } from '@stores/user.store'
import SaleApiService from '@services/sale.api'
import type { SaleItemCreate } from '@/types/sale.types'
import type { Product } from '@/types/product.types'
import type { PaymentMethod } from '@services/sale.api'

const router = useRouter()
const { createSale } = useSales()
const productStore = useProductStore()
const { customers, loadCustomers } = useCustomers()
const userStore = useUserStore()

const error = ref('')
const selectedProductId = ref('')
const itemQuantity = ref(1)
const itemPrice = ref(0)
const itemDiscount = ref(0)
const paymentMethods = ref<PaymentMethod[]>([])

const selectedProduct = computed(() => productStore.products.find((p: Product) => p.id === selectedProductId.value))

const getProductInFormQuantity = (productId: string) =>
  form.value.items
    .filter(item => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0)

const getProductRemainingStock = (product: Product) =>
  product.stock - getProductInFormQuantity(product.id)

const availableProducts = computed(() =>
  productStore.products.filter((p: Product) => p.active && getProductRemainingStock(p) > 0)
)

const existingQuantity = computed(() =>
  selectedProductId.value ? getProductInFormQuantity(selectedProductId.value) : 0
)

const maxQuantity = computed(() => {
  if (!selectedProduct.value) return 1
  return Math.max(1, getProductRemainingStock(selectedProduct.value))
})

interface FormItem extends SaleItemCreate {
  subtotal: number
}

const form = ref({
  folio: '',
  customerId: undefined as string | undefined,
  paymentMethodId: '',
  observations: '',
  userId: '',
  discount: 0,
  items: [] as FormItem[],
})

const subtotal = computed(() => form.value.items.reduce((sum, item) => sum + item.subtotal, 0))
const taxableAmount = computed(() => Math.max(0, subtotal.value - (form.value.discount || 0)))
const tax = computed(() => taxableAmount.value * 0.16)
const total = computed(() => taxableAmount.value + tax.value)

onMounted(async () => {
  productStore.loadProducts()
  loadCustomers()
  paymentMethods.value = await SaleApiService.getPaymentMethods()
  form.value.userId = userStore.currentUser?.id || ''
})

watch(selectedProductId, (id) => {
  itemDiscount.value = 0
  if (!id) {
    itemPrice.value = 0
    itemQuantity.value = 1
    return
  }
  const product = selectedProduct.value
  if (product) {
    itemPrice.value = product.salePrice
    if (itemQuantity.value > maxQuantity.value) {
      itemQuantity.value = maxQuantity.value
    }
  }
})

function productName(id: string) {
  return productStore.products.find((p: Product) => p.id === id)?.name || id
}

function addItem() {
  error.value = ''
  if (!selectedProductId.value || itemQuantity.value <= 0) return
  const product = selectedProduct.value
  if (!product) return
  const existingQty = form.value.items
    .filter(item => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0)
  if (existingQty + itemQuantity.value > product.stock) {
    error.value = `Solo hay ${product.stock} unidades disponibles de "${product.name}". Ya agregaste ${existingQty}.`
    return
  }
  const price = itemPrice.value
  const discount = itemDiscount.value || 0
  const effectivePrice = Math.max(0, price - discount)
  const lineDiscount = discount * itemQuantity.value
  const sub = itemQuantity.value * effectivePrice
  form.value.items.push({
    productId: selectedProductId.value,
    quantity: itemQuantity.value,
    unitPrice: price,
    discount: lineDiscount,
    subtotal: sub,
  } as FormItem)
  selectedProductId.value = ''
  itemQuantity.value = 1
  itemPrice.value = 0
  itemDiscount.value = 0
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
      items: form.value.items.map(({ productId, quantity, unitPrice, discount }) => ({ productId, quantity, unitPrice, discount }))
    }
    await createSale(payload)
    await productStore.loadProducts()
    router.push('/sales')
  } catch (err: any) {
    error.value = err.message || 'Error al guardar'
  }
}
</script>
