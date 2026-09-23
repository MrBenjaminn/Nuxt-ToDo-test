import { useTodoStore } from '@/entities/model/store'
import type { cardTodo, itemTodo } from '@/entities/type/type'

export function useNoteDraft(noteId?: string) {
  const store = useTodoStore()

  const draftNote = ref<cardTodo | null>(null)

  if (noteId) {
    watch(
      () => store.getNoteById(noteId),
      (newNote) => {
        if (newNote && !draftNote.value) {
          draftNote.value = JSON.parse(JSON.stringify(newNote))
        }
      },
      { immediate: true },
    )
  }

  function addTodoTask() {
    if (!draftNote.value) return
    const newTodoList: itemTodo = {
      id: crypto.randomUUID(),
      text: '',
      done: false,
    }
    draftNote.value.todoList = [...draftNote.value.todoList, newTodoList]
    console.log(draftNote.value)
  }

  function deleteTodoTask(idTask: string) {
    if (!draftNote.value) return
    draftNote.value.todoList = draftNote.value.todoList.filter((el) => el.id !== idTask)
  }

  function save() {
    if (!draftNote.value) return
    console.log(draftNote.value)

    if (noteId) {
      store.updateNoteCard(draftNote.value)
    }
    navigateTo('/')
  }

  async function deleteDraftNote() {
    await navigateTo('/')
  }

  return {
    draftNote,
    addTodoTask,
    save,
    deleteDraftNote,
    deleteTodoTask,
  }
}
