<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
      :class="colorClasses"
    >
      {{ icon }}
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
      <p class="text-xl font-bold">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  icon: string
  color: string
}>()

const colorClasses = computed(() => {
  const map: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300',
    pink: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300',
  }
  return map[props.color] || map.blue
})
</script>
