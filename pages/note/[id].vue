<script setup>
import Plus from '@/shared/icons/plus.svg?component'
import Button from '@/shared/ui/Button/Button.vue'
import ActionsEdit from '@/features/ui/ActionsEdit.vue'
import HeaderEdit from '@/features/ui/HeaderEdit.vue'
import Todo from '@/widgets/ui/Todo.vue'
import { useNoteDraft } from '@/features/model/useDraftTodo'
import { useHistory } from '@/features/model/useHistory'
import { useTodoStore } from '@/entities/model/store'
import TodoList from '@/entities/ui/TodoList.vue'

const route = useRoute()
const store = useTodoStore()
const draftTodo = useNoteDraft(String(route.params.id))
const { undo, redo, canUndo, canRedo } = useHistory(draftTodo.draftNote, 50, 500)

async function handleDeleteTodo() {
  const noteId = String(route.params.id)
  store.deleteTodoCard(noteId)
  await navigateTo('/')
}
</script>

<template>
  <Todo v-if="draftTodo.draftNote.value">
    <template #header>
      <HeaderEdit
        v-model:text="draftTodo.draftNote.value.title"
        @deleteNote="handleDeleteTodo"
      />
      <Button
        variant="tertiary"
        @click="draftTodo.addTodoTask()"
      >
        <Plus />Добавить заметку
      </Button>
    </template>
    <TodoList
      :todoListCard="draftTodo.draftNote.value.todoList"
      :flag="true"
      @delete="draftTodo.deleteTodoTask"
    />
    <template #actions>
      <ActionsEdit
        :can-undo="canUndo"
        :can-redo="canRedo"
        @save="draftTodo.save"
        @redo="redo"
        @undo="undo"
      />
    </template>
  </Todo>
</template>

<style lang="scss" scoped></style>
