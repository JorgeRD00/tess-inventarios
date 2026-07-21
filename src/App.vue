<template>
  <MainLayout v-if="!isPublicRoute">
    <router-view />
  </MainLayout>
  <router-view v-else />
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@stores/ui.store'
import MainLayout from '@presentation/components/layout/MainLayout.vue'

const uiStore = useUiStore()
const route = useRoute()
const isPublicRoute = computed(() => !!route.meta.public)

onMounted(() => {
  uiStore.initializeTheme()
})
</script>
