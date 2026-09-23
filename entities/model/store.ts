import { defineStore } from 'pinia'
import type { itemTodo, cardTodo } from '@/entities/type/type'

export const useTodoStore = defineStore('todo', () => {
  const allTodos = ref<cardTodo[]>([])

  const getNoteById = computed(() => {
    return (id: string) => allTodos.value.find((note) => note.id === id)
  })

  function addTodoTask(obj: cardTodo) {
    const newTodoList: itemTodo = {
      id: crypto.randomUUID(),
      text: '',
      done: false,
    }
    obj.todoList.push(newTodoList)
  }

  function deleteTodoTask(currentNote: cardTodo, idTask: string) {
    const index = currentNote.todoList.findIndex((e) => e.id === idTask)
    currentNote.todoList.splice(index, 1)
  }

  function deleteTodoCard(id: string) {
    const index = allTodos.value.findIndex((e) => e.id === id)
    allTodos.value.splice(index, 1)
  }

  function addTodoCard() {
    const newId = crypto.randomUUID()

    const newNote: cardTodo = {
      id: newId,
      title: '',
      todoList: [],
      lastUpdate: Date.now(),
    }

    allTodos.value.push(newNote)

    return newId
  }

  function updateNoteCard(obj: cardTodo) {
    const index = allTodos.value.findIndex((e) => e.id === obj.id)
    allTodos.value[index] = obj
  }

  const totalCompletedCount = computed(() => {
    return allTodos.value.reduce((total, card) => {
      const completedInCard = card.todoList.filter((task) => task.done).length
      return total + completedInCard
    }, 0)
  })

  return {
    getNoteById,
    allTodos,
    addTodoTask,
    deleteTodoTask,
    addTodoCard,
    deleteTodoCard,
    updateNoteCard,
    totalCompletedCount,
  }
})
