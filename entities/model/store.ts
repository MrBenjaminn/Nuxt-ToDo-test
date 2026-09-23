import { defineStore } from 'pinia'
import type { itemTodo, cardTodo, localStorage } from '@/entities/type/type'
import { safeClone } from '@/shared/lib/cloneObj.ts'

const CURRENT_VERSION = 1
const STORAGE_KEY = 'my_notes_app_data'

export const useTodoStore = defineStore('todo', () => {
  const allTodos = ref<cardTodo[]>([])

  let isListenerAttached = false

  const getNoteById = computed(() => {
    return (id: string) => allTodos.value.find((note) => note.id === id)
  })

  function initStore() {
    if (!import.meta.client) return

    const rawData = localStorage.getItem(STORAGE_KEY)
    if (!rawData) return

    try {
      const parsed: localStorage = JSON.parse(rawData)

      if (parsed.version === CURRENT_VERSION) {
        allTodos.value = parsed.todos || []
      } else {
        console.warn('Версия устарела. Выполнен сброс.')
        allTodos.value = []
      }
    } catch (e) {
      console.error('Ошибка при чтении localStorage:', e)
    }

    if (!isListenerAttached) {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
          initStore()
        }
      })
      isListenerAttached = true
    }
  }

  function persistToStorage() {
    if (!import.meta.client) return

    const dataToSave = {
      version: CURRENT_VERSION,
      todos: allTodos.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }

  function saveTodo(updatedNote: cardTodo) {
    const index = allTodos.value.findIndex((n) => n.id === updatedNote.id)
    const clonedNote = safeClone(updatedNote)
    if (index !== -1) {
      allTodos.value[index] = clonedNote
    } else {
      allTodos.value.push(clonedNote)
    }

    persistToStorage()
  }

  function deleteTodoCard(id: string) {
    const index = allTodos.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      allTodos.value.splice(index, 1)
      persistToStorage()
    }
  }

  function addTodoCard() {
    const newId = crypto.randomUUID()

    const newNote: cardTodo = {
      id: newId,
      title: '',
      todoList: [],
      lastUpdate: Date.now(),
    }

    allTodos.value.push(safeClone(newNote))
    persistToStorage()

    return newId
  }

  const totalCompletedCount = computed(() => {
    return allTodos.value.reduce((total, card) => {
      const completedInCard = card.todoList.filter((task) => task.done).length
      return total + completedInCard
    }, 0)
  })

  if (import.meta.client) {
    initStore()
  }

  return {
    getNoteById,
    allTodos,
    addTodoCard,
    deleteTodoCard,
    totalCompletedCount,
    saveTodo,
    initStore,
  }
})
