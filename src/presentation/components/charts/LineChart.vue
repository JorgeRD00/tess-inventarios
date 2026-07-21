<template>
  <div class="w-full">
    <h3 v-if="title" class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{{ title }}</h3>
    <div v-if="!series.length || !labels.length" class="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">Sin datos</div>
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
        >{{ formatCurrency(tick) }}</text>
      </g>

      <!-- x labels -->
      <g v-for="(label, i) in visibleLabels" :key="label.text + '-' + i">
        <text
          :x="xScale(label.index)" :y="bottom + 16"
          text-anchor="middle"
          class="text-xs fill-gray-600 dark:fill-gray-400"
        >{{ label.text }}</text>
      </g>

      <!-- lines and dots -->
      <g v-for="(s, sIndex) in series" :key="s.name">
        <polyline
          :points="pointsFor(s)"
          fill="none"
          :stroke="s.color || defaultColors[sIndex % defaultColors.length]"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          v-for="(value, i) in s.data" :key="`${s.name}-${i}`"
          :cx="xScale(i)" :cy="yScale(value)" r="4"
          :fill="s.color || defaultColors[sIndex % defaultColors.length]"
          class="stroke-white dark:stroke-gray-800"
          stroke-width="1"
        />
      </g>

      <!-- legend -->
      <g transform="translate(60, 10)">
        <g v-for="(s, i) in series" :key="`legend-${s.name}`" :transform="`translate(${i * 120}, 0)`">
          <rect width="10" height="10" :fill="s.color || defaultColors[i % defaultColors.length]" rx="2" />
          <text x="14" y="9" class="text-xs fill-gray-700 dark:fill-gray-300">{{ s.name }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface LineChartSeries {
  name: string
  data: number[]
  color?: string
}

interface Props {
  labels: string[]
  series: LineChartSeries[]
  title?: string
}

const props = defineProps<Props>()

const left = 60
const right = 560
const top = 30
const bottom = 240

const chartWidth = right - left
const chartHeight = bottom - top

const defaultColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

const allValues = computed(() => props.series.flatMap(s => s.data))
const maxValue = computed(() => Math.max(...allValues.value, 1))

const yTicks = computed(() => {
  const count = 5
  const step = maxValue.value / count
  return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i))
})

function yScale(value: number) {
  return bottom - (value / maxValue.value) * chartHeight
}

function xScale(index: number) {
  if (props.labels.length <= 1) return left + chartWidth / 2
  return left + (index / (props.labels.length - 1)) * chartWidth
}

const visibleLabels = computed(() => {
  const maxLabels = 5
  const step = Math.max(1, Math.ceil((props.labels.length - 1) / (maxLabels - 1)))
  return props.labels
    .map((text, index) => ({ text, index }))
    .filter((_, i) => i % step === 0 || i === props.labels.length - 1)
})

function pointsFor(series: LineChartSeries) {
  return series.data
    .map((value, i) => `${xScale(i)},${yScale(value)}`)
    .join(' ')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value || 0)
}
</script>
