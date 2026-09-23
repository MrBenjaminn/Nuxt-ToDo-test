<script setup lang="ts">
import TodoItem from '@/entities/ui/TodoItem.vue'
import  { type itemTodo, } from '@/entities/type/type'

enum emitsActions {
  Delete = 'delete',
  Toggle = 'toggle',
  Blur = 'blur'
}

defineProps<{
  flag?: boolean
  todoListCard?: itemTodo[]
}>()

defineEmits<{
  (e: emitsActions.Delete, id: string): void
  (e: emitsActions.Toggle, id: string): void
  (e: emitsActions.Blur): void
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
      @toggle="$emit(emitsActions.Toggle, el.id)"
      :key="el.id"
      @delete="$emit(emitsActions.Delete, el.id)"
      @blur="$emit(emitsActions.Blur)"
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

  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $color-gray-4;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: $color-dark-2;
  }
}

.todo__empty-message {
  text-align: center;
  color: $color-gray-4;
}
</style>
