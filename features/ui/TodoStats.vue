<script setup lang="ts">
import type { itemTodo } from '@/entities/type/type'
import { ButtonType } from '@/shared/ui/Button/model/type'

const props = defineProps<{
  todoList: itemTodo[]
}>()

const completedCount = computed(() => {
  return props.todoList.filter((task) => task.done).length
})
</script>

<template>
  <div class="todo__info">
    <div class="todo__total-tasks">Tasks done: {{ completedCount }}</div>
    <button
      class="todo__delete-all-button"
      :type="ButtonType.Button"
    >
      Delete all
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.todo__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 16px;
  font-weight: 600;
}

.todo__delete-all-button {
  padding: 0;
  background-color: transparent;
  border: none;

  &:hover {
    color: $color-gray-4;
  }

  &:not(.is-visible) {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
