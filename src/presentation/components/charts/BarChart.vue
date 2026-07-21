<template>
  <div class="w-full">
    <h3 v-if="title" class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{{ title }}</h3>
    <div v-if="!data.length" class="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">Sin datos</div>
    <svg
      v-else
      viewBox="0 0 600 320"
      class="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- axes -->
      <line
        :x1="left" :y1="top" :x2="left" :y2="bottom"
        class="stroke-gray-300 dark:stroke-gray-600"
        stroke-width="1"
      />
      <line
        :x1="left" :y1="bottom" :x2="right" :y2="bottom"
        class="stroke-gray-300 dark:stroke-gray-600"
        stroke-width="1"
      />

      <!-- y ticks -->
      <g v-for="tick in yTicks" :key="tick">
        <line
          :x1="left" :y1="yScale(tick)" :x2="right" :y2="yScale(tick)"
          class="stroke-gray-100 dark:stroke-gray-700"
          stroke-width="1"
        />
        <text
          :x="left - 8" :y="yScale(tick) + 4"
          text-anchor="end"
          class="text-xs fill-gray-500 dark:fill-gray-400"
        >{{ formatNumber(tick) }}</text>
      </g>

      <!-- bars -->
      <g v-for="(item, i) in data" :key="item.label + i">
        <rect
          :x="barX(i)" :y="yScale(item.value)"
          :width="barWidth" :height="bottom - yScale(item.value)"
          :fill="item.color || defaultColors[i % defaultColors.length]"
          rx="4"
        />
        <text
          :x="barX(i) + barWidth / 2" :y="bottom + 18"
          text-anchor="middle"
          class="text-xs fill-gray-600 dark:fill-gray-400"
        >
          <title>{{ item.label }}</title>
          {{ truncatedLabel(item.label) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BarChartItem {
  label: string
  value: number
  color?: string
}

interface Props {
  data: BarChartItem[]
  title?: string
}

const props = defineProps<Props>()

const left = 50
const right = 560
const top = 20
const bottom = 240

const chartWidth = right - left
const chartHeight = bottom - top

const defaultColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

const maxValue = computed(() => Math.max(...props.data.map(d => d.value), 1))

const yTicks = computed(() => {
  const count = 5
  const step = maxValue.value / count
  return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i))
})

function yScale(value: number) {
  return bottom - (value / maxValue.value) * chartHeight
}

const barWidth = computed(() => {
  const gap = 12
  return Math.max(16, (chartWidth - gap * (props.data.length + 1)) / props.data.length)
})

function barX(index: number) {
  const totalWidth = props.data.length * barWidth.value + (props.data.length + 1) * 12
  const startX = left + (chartWidth - totalWidth) / 2 + 12
  return startX + index * (barWidth.value + 12)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value)
}

function truncatedLabel(label: string) {
  const maxChars = Math.max(4, Math.floor(barWidth.value / 6))
  if (label.length <= maxChars) return label
  return label.slice(0, maxChars - 3) + '...'
}
</script>
