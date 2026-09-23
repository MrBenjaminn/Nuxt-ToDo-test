<script setup lang="ts">
import Plus from '@/shared/icons/plus.svg?component'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonSize, ButtonType, ButtonVariant } from '@/shared/ui/Button/model/type'
import ActionsEdit from '@/features/ui/ActionsEdit.vue'
import HeaderEdit from '@/features/ui/HeaderEdit.vue'
import Todo from '@/widgets/ui/Todo.vue'
import { useNoteDraft } from '@/features/model/useDraftTodo'
import { useTodoStore } from '@/entities/model/store'
import TodoList from '@/entities/ui/TodoList.vue'
import { useKeybind } from '@/features/model/useKeybind'
import Modal from '@/shared/ui/modal/Modal.vue'
import { useTodoRouteGuard } from '@/features/model/useTodoRouteGuard'
import { useTodoModals } from '@/shared/ui/modal/model/useTodoModals'
import { vFocusTrap } from '@/shared/directives/vFocusTrap'

const route = useRoute()
const router = useRouter()
const noteId = route.params.id as string

const store = useTodoStore()
const todoNote = computed(() => store.getNoteById(noteId))

const { activeModal, isModalOpen, modalConfig, handleConfirm, handleCancel } = useTodoModals({
  onDelete: async () => {
    discardDraft()
    store.deleteTodoCard(todoId)
    await navigateTo('/')
  },
  onConfirmEmptyDelete: async () => {
    discardDraft()
    store.deleteTodoCard(todoId)
    await navigateTo('/')
  },
  onSaveRestore: async () => {
    save()
  },
  onRejectRestore: async () => {
    discardDraft()
    initDraft()
  },
  onConfirmCancel: async () => {
    discardDraft()
    await navigateTo('/')
  },
})

const isDraftDirty = computed(() => {
  if (!note.value || !draftNote.value) return false
  return JSON.stringify(note.value) !== JSON.stringify(draftNote.value)
})

const { todoId, note, checkNoteExists } = useTodoRouteGuard(isDraftDirty, activeModal)

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
  discardDraft,
} = useNoteDraft(todoId)

useKeybind(
  () => undo(),
  () => redo(),
)

onMounted(() => {
  if (!checkNoteExists()) return

  initDraft()

  if (isDraftDirty.value) {
    activeModal.value = 'restore'
  }
})

const isEmptyTodo = computed(() => {
  if (!draftNote.value) return true

  const isTitleEmpty = !draftNote.value.title.trim()
  const isTodoListEmpty =
    draftNote.value.todoList.length === 0 ||
    draftNote.value.todoList.every((item) => !item.text.trim())

  return isTitleEmpty && isTodoListEmpty
})

function onRequestDelete() {
  activeModal.value = 'delete'
}

async function handleSave() {
  save()
  await navigateTo('/')
}

async function handleBack() {
  if (isEmptyTodo.value) {
    activeModal.value = 'empty'
    return
  }

  if (isDraftDirty.value) {
    activeModal.value = 'cancel'
    return
  }
  discardDraft()
  await navigateTo('/')
}

watch(
  todoNote,
  (currentNote) => {
    if (!currentNote) {
      router.replace('/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <Todo
    v-if="draftNote"
    v-focus-trap
  >
    <template #header>
      <HeaderEdit
        v-model="draftNote.title"
        @deleteNote="onRequestDelete"
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
</template>

<style lang="scss" scoped></style>
