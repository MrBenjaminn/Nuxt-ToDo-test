<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'
import Todo from '@/widgets/ui/Todo.vue'
import TodoList from '@/entities/ui/TodoList.vue'
import { useTodoStore } from '@/entities/model/store'
import TodoStats from '@/features/ui/TodoStats.vue'
import { ButtonType, ButtonVariant } from '@/shared/ui/Button/model/type'

const BUTTON_LABELS = {
  CHANGE: 'Редактировать',
  DELETE: 'Удалить',
  CREATE: 'Создать заметку',
} as const

const store = useTodoStore()
function handleCreateNote() {
  const newNoteId = store.addTodoCard()
  navigateTo(`/note/${newNoteId}`)
}
</script>

<template>
  <div>
    <header class="header">
      <Button
        :variant="ButtonVariant.Primary"
        :text="BUTTON_LABELS.CREATE"
        :buttonType="ButtonType.Button"
        @click="handleCreateNote"
      />
    </header>

    <main class="main-page">
      <section class="content">
        <Todo
          v-for="el in store.allTodos"
          :key="el.id"
        >
          <template #header>
            <h3 class="todo__title">{{ el.title }}</h3>
            <TodoStats :todoList="el.todoList" />
          </template>

          <TodoList
            :flag="false"
            :todoListCard="el.todoList || []"
          />

          <template #actions>
            <Button
              :variant="ButtonVariant.Primary"
              :text="BUTTON_LABELS.CHANGE"
              :buttonType="ButtonType.Button"
              @click="navigateTo(`/note/${el.id}`)"
            />
            <Button
              :variant="ButtonVariant.Primary"
              :text="BUTTON_LABELS.DELETE"
              :buttonType="ButtonType.Button"
              @click="store.deleteTodoCard(el.id)"
            />
          </template>
        </Todo>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.header {
  width: 100%;
  max-width: 1400px;
  padding: 40px 16px 0;
  margin: auto;
}

.main-page {
  width: 100%;
  max-width: 1400px;
  padding: 0 16px;
  margin: auto;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.todo__title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}
</style>
