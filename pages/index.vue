<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'
import Todo from '@/widgets/ui/Todo.vue'
import TodoList from '@/entities/ui/TodoList.vue'
import { useTodoStore } from '@/entities/model/store'
import TodoStats from '@/features/ui/TodoStats.vue'
import {
  ButtonSize,
  ButtonType,
  ButtonVariant
} from '@/shared/ui/Button/model/type'
import { useTodoModals } from "@/shared/ui/modal/model/useTodoModals.ts";
import Modal from "@/shared/ui/modal/Modal.vue";

const buttonLabels = {
  change: 'Редактировать',
  delete: 'Удалить',
  create: 'Создать заметку',
} as const

const store = useTodoStore()
const noteToDeleteId = ref<string | null>(null)
function handleCreateNote() {
  const newNoteId = store.addTodoCard()
  navigateTo(`/note/${newNoteId}`)
}

const {
  activeModal,
  isModalOpen,
  modalConfig,
  handleConfirm,
  handleCancel,
} = useTodoModals({
  onDelete: async () => {
    if (noteToDeleteId.value) {
      store.deleteTodoCard(noteToDeleteId.value)
      noteToDeleteId.value = null
    }
  }
})

function openDeleteModal(id: string) {
  noteToDeleteId.value = id
  activeModal.value = 'delete'
}
</script>

<template>
  <div>
    <header class="header">
      <Button
        :variant="ButtonVariant.Primary"
        :text="buttonLabels.create"
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
              :text="buttonLabels.change"
              :buttonType="ButtonType.Button"
              @click="navigateTo(`/note/${el.id}`)"
            />
            <Button
              :variant="ButtonVariant.Primary"
              :text="buttonLabels.delete"
              :buttonType="ButtonType.Button"
              @click="openDeleteModal(el.id)"
            />
          </template>
        </Todo>
        <Modal
          v-if="modalConfig"
          v-model:is-open="isModalOpen"
          :title="modalConfig.title"
        >
          <p>{{ modalConfig.text }}</p>

          <template #footer>
            <Button
              :type="ButtonType.Button"
              :variant="ButtonVariant.Tertiary"
              @click="handleCancel"
            >
              {{ modalConfig.cancelText }}
            </Button>
            <Button
              :type="ButtonType.Button"
              :variant="ButtonVariant.Primary"
              @click="handleConfirm"
              :size="ButtonSize.Big"
            >
              {{ modalConfig.confirmText }}
            </Button>
          </template>
        </Modal>
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
