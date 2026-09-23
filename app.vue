<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '@/entities/model/store'

const store = useTodoStore()

onMounted(() => {
  store.initStore()
})
</script>

<template>
  <NuxtPage />
</template>

<style scoped></style>