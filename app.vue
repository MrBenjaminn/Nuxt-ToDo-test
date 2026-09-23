<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '@/entities/model/store'
import '@/assets/styles/tooltip.scss'

const store = useTodoStore()

onMounted(() => {
  store.initStore()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
