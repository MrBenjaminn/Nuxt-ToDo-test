import { computed, type Ref } from 'vue'
import { useTodoStore } from '@/entities/model/store'
import { type ModalType } from '@/shared/ui/modal/type/type'

export function useTodoRouteGuard(isDraftDirty: Ref<boolean>, activeModal: Ref<ModalType>) {
  const route = useRoute()
  const store = useTodoStore()

  const rawId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  const todoId = rawId ?? ''

  if (!todoId) {
    showError({
      statusCode: 404,
      statusMessage: 'Заметка с таким ID не найдена',
      fatal: true,
    })
  }

  if (import.meta.client && store.allTodos.length === 0) {
    store.initStore()
  }

  const note = computed(() => store.getNoteById(todoId))

  function checkNoteExists() {
    if (!note.value) {
      showError({
        statusCode: 404,
        statusMessage: 'Заметка с таким ID не найдена',
        fatal: true,
      })
      return false
    }
    return true
  }

  onBeforeRouteLeave((to, from, next) => {
    if (isDraftDirty.value && activeModal.value !== 'cancel') {
      activeModal.value = 'cancel'
      next(false)
    } else {
      next()
    }
  })

  return {
    todoId,
    note,
    checkNoteExists,
  }
}
