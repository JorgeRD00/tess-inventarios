<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h1>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Código interno</label>
          <input v-model="form.internalCode" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Nombre</label>
          <input v-model="form.name" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Categoría</label>
          <select v-model="form.categoryId" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Marca</label>
          <select v-model="form.brandId" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Unidad</label>
          <input v-model="form.unit" placeholder="pza, kg, lt" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Ubicación</label>
          <input v-model="form.location" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Stock</label>
          <input v-model.number="form.stock" type="number" min="0" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Stock mínimo</label>
          <input v-model.number="form.minStock" type="number" min="0" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Precio compra</label>
          <input v-model.number="form.purchasePrice" type="number" min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Precio venta</label>
          <input v-model.number="form.salePrice" type="number" min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Proveedor</label>
          <select v-model="form.supplierId" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option :value="null">Ninguno</option>
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Descripción</label>
        <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Imagen</label>
        <div class="flex items-center gap-4">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="Vista previa"
            class="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <div
            v-else
            class="h-32 w-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center"
          >
            Sin imagen
          </div>
          <div class="flex flex-col gap-2">
            <button
              type="button"
              @click="imageInput?.click()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ imagePreview ? 'Cambiar imagen' : 'Agregar imagen' }}
            </button>
            <button
              v-if="imagePreview"
              type="button"
              @click="removeImage"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Quitar imagen
            </button>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            />
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label class="inline-flex items-center gap-2">
          <input v-model="form.active" type="checkbox" class="rounded" />
          <span>Activo</span>
        </label>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
        <router-link to="/inventory" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</router-link>
      </div>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@composables/useProducts'
import { useCategories } from '@composables/useCategories'
import { useSuppliers } from '@composables/useSuppliers'
import type { ProductImageCreate } from '@/types/product.types'

const route = useRoute()
const router = useRouter()
const { createProduct, updateProduct, loadProductById } = useProducts()
const { categories, brands, loadCategories, loadBrands } = useCategories()
const { suppliers, loadSuppliers } = useSuppliers()

const isEdit = computed(() => !!route.params.id)
const productId = computed(() => route.params.id as string)
const error = ref('')

const imageInput = ref<HTMLInputElement | null>(null)

const form = ref({
  internalCode: '',
  name: '',
  description: '',
  categoryId: '',
  brandId: '',
  unit: '',
  location: '',
  stock: 0,
  minStock: 0,
  maxStock: undefined as number | undefined,
  purchasePrice: 0,
  salePrice: 0,
  supplierId: undefined as string | undefined,
  active: true,
  images: [] as ProductImageCreate[],
})

const imagePreview = computed(() => form.value.images[0]?.path || null)

onMounted(async () => {
  await Promise.all([loadCategories(), loadSuppliers(), loadBrands()])
  if (isEdit.value) {
    const product = await loadProductById(productId.value)
    Object.assign(form.value, product)
    form.value.images = (product.images || []).map(img => ({ path: img.path, order: img.order }))
  }
})

async function handleSubmit() {
  error.value = ''
  try {
    if (isEdit.value) {
      await updateProduct({ id: productId.value, ...form.value, images: form.value.images })
    } else {
      await createProduct({ ...form.value, images: form.value.images })
    }
    router.push('/inventory')
  } catch (err: any) {
    error.value = err.message || 'Error al guardar'
  }
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    form.value.images = [{ path: reader.result as string, order: 0 }]
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  form.value.images = []
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}
</script>
