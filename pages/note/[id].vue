<script setup lang="ts">
import Plus from '@/shared/icons/plus.svg?component'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'
import ActionsEdit from '@/features/ui/ActionsEdit.vue'
import HeaderEdit from '@/features/ui/HeaderEdit.vue'
import Todo from '@/widgets/ui/Todo.vue'
import { useNoteDraft } from '@/features/model/useDraftTodo'
import { useTodoStore } from '@/entities/model/store'
import TodoList from '@/entities/ui/TodoList.vue'

const route = useRoute()
const store = useTodoStore()
const todoId = String(route.params.id)


const {
  draftNote,
  initDraft,
  addTodoTask,
  deleteTodoTask,
  toggleTask,
  undo,
  redo,
  canUndo,
  canRedo,
  handleBlur,
  save,
} = useNoteDraft(todoId)

onMounted(() => {
  initDraft()
})

async function handleDeleteTodo() {
  if(!todoId) return
  store.deleteTodoCard(todoId)
  await navigateTo('/')
}

async function handleSave() {
  save()
  await navigateTo('/')
}

async function handleBack() {
  await navigateTo('/')
}
</script>

<template>
  <Todo v-if="draftNote">
    <template #header>
      <HeaderEdit
        v-model:text="draftNote.title"
        @deleteNote="handleDeleteTodo"
        @blur="handleBlur"
      />
      <Button
        :variant="ButtonVariant.Tertiary"
        @click="addTodoTask"
      >
        <Plus />Добавить заметку
      </Button>
    </template>
    <TodoList
      :todoListCard="draftNote.todoList"
      :flag="true"
      @delete="deleteTodoTask"
      @toggle="toggleTask"
      @blur="handleBlur"
    />
    <template #actions>
      <ActionsEdit
        :can-undo="canUndo"
        :can-redo="canRedo"
        @back="handleBack"
        @save="handleSave"
        @redo="redo"
        @undo="undo"
      />
    </template>
  </Todo>
</template>

<style lang="scss" scoped></style>
