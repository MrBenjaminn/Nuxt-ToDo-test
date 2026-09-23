<script setup lang="ts">
import type { itemTodo } from '@/entities/type/type'

const props = defineProps<{
  todoList: itemTodo[]
}>()

const completedCount = computed(() => {
  return props.todoList.filter((task) => task.done).length
})
</script>

<template>
  <div class="todo__info">
    <div class="todo__total-tasks">Задач: {{todoList.length}}</div>
    <div class="todo__total-tasks">Выполненых задач: {{ completedCount }}</div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.todo__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 14px;
  font-weight: 500;
  color: $color-dark-2;
}
</style>
