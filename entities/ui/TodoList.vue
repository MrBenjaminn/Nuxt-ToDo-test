<script setup lang="ts">
import TodoItem from '@/entities/ui/TodoItem.vue'
import { type itemTodo } from '@/entities/type/type'
const props = defineProps<{
  flag?: boolean
  todoListCard?: itemTodo[]
}>()

const emit = defineEmits<{
  toggle: [id:string]
  delete: [id:string]
  blur:[]
}>()

function onToggle(id: string) {
  emit('toggle', id)
}

function onDelete(id: string) {
  emit('delete', id)
}

function onBlur() {
  emit('blur')
}

const displayedTodoList = computed(() => {
  const list = props.todoListCard || []
  return props.flag ? list : list.slice(0, 4)
})

const hiddenCount = computed(() => {
  const list = props.todoListCard || []
  return !props.flag && list.length > 4 ? list.length - 4 : 0
})

const shortCutText = computed(() => {
  return hiddenCount.value === 1
    ? 'пункт' : hiddenCount.value < 5
      ? 'пункта' : 'пунктов'})
</script>

<template>
  <ul
    class="todo__list"
    v-if="todoListCard?.length"
  >
    <TodoItem
      :isEditing="flag"
      v-for="el in displayedTodoList"
      v-model="el.text"
      v-model:done="el.done"
      @toggle="onToggle(el.id)"
      @delete="onDelete(el.id)"
      @blur="onBlur"
      :key="el.id"
    />
  </ul>
  <div
    class="todo__more-hint"
    v-if="hiddenCount > 0"
  >
    ...и еще {{ hiddenCount }} {{ shortCutText }}
  </div>
  <div
    class="todo__empty-message"
    v-else-if="!props.todoListCard?.length"
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

.todo__more-hint {
  text-align: center;
  color: $color-gray-3;
}
</style>
