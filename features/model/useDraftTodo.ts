import { useTodoStore } from '@/entities/model/store'
import { safeClone } from '#shared/lib/cloneObj'
import type { cardTodo, itemTodo } from '@/entities/type/type'
import { useHistory } from "~/features/model/useHistory.ts";

export function useNoteDraft(noteId?: string) {
  const store = useTodoStore()
  const draftNote = ref<cardTodo | null>(null)

  const draftKey = `note_draft_${noteId}`

  const {
    undo,
    redo,
    canUndo,
    canRedo,
    handleBlur,
    recordAtomic,
    clearHistory,
  } = useHistory(draftNote, draftKey)


  function initDraft() {
    if (!import.meta.client || !noteId) return

    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft) {
      try {
        draftNote.value = JSON.parse(savedDraft)
        return
      } catch (e) {
        console.error('Ошибка чтения черновика:', e)
      }
    }

    if (store.allTodos.length === 0) {
      store.initStore()
    }

    const original = store.getNoteById(noteId)
    if (original) {
      draftNote.value = safeClone(original)
    }
  }

  let draftTimeout: ReturnType<typeof setTimeout> | null = null
  watch(
    draftNote,
    (newVal) => {
      if (!newVal || !import.meta.client) return

      if (draftTimeout) clearTimeout(draftTimeout)
      draftTimeout = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(newVal))
      }, 500)
    },
    { deep: true },
  )

  onUnmounted(() => {
    if (draftTimeout) clearTimeout(draftTimeout)
  })

  function toggleTask(taskId: string) {
    recordAtomic(() => {
      if (!draftNote.value) return
      const task = draftNote.value.todoList.find((t) => t.id === taskId)
      if (task) {
        task.done = !task.done
      }
    })
  }

  function addTodoTask() {
    recordAtomic(() => {
      if (!draftNote.value) return
      const newTodoList: itemTodo = {
        id: crypto.randomUUID(),
        text: '',
        done: false,
      }
      draftNote.value.todoList = [...draftNote.value.todoList, newTodoList]
    })
  }

  function deleteTodoTask(idTask: string) {
    recordAtomic(() => {
      if (!draftNote.value) return
      draftNote.value.todoList = draftNote.value.todoList.filter((el) => el.id !== idTask)
    })
  }

  function save() {
    handleBlur()

    if (draftNote.value) {
      draftNote.value.lastUpdate = Date.now()
      store.saveTodo(draftNote.value)

      localStorage.removeItem(draftKey)
      clearHistory()
    }
  }

  return {
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
  }
}
