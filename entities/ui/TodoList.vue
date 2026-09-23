<script setup lang="ts">
import TodoItem from '@/entities/ui/TodoItem.vue'
import type { itemTodo } from '@/entities/type/type'

defineProps<{
  flag?: boolean
  todoListCard?: itemTodo[]
}>()

defineEmits<{
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <ul
    class="todo__list"
    v-if="todoListCard?.length"
  >
    <TodoItem
      :isEditing="flag"
      v-for="el in todoListCard"
      v-model="el.text"
      v-model:done="el.done"
      :key="el.id"
      :elId="el.id"
      @delete="$emit('delete', $event)"
    />
  </ul>
  <div
    class="todo__empty-message"
    v-else
  >
    Нет заметок
  </div>
</template>

<style lang="scss" scoped>
$todoListRowGap: 8px;
@use '@/assets/styles/variables' as *;
.todo__list,
.todo__empty-message {
  &:empty {
    display: none;
  }
}

.todo__list {
  display: grid;
  row-gap: $todoListRowGap;
}

.todo__empty-message {
  text-align: center;
  color: $color-gray-4;
}
</style>
