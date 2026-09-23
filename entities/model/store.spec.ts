import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTodoStore } from '@/entities/model/store'
import type { cardTodo } from '@/entities/type/type'

vi.mock('@/shared/lib/cloneObj.ts', () => ({
  safeClone: <T>(obj: T): T => JSON.parse(JSON.stringify(obj)),
}))

describe('useTodoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('создает новую заметку с уникальным ID через addTodoCard', () => {
    const store = useTodoStore()
    const newId = store.addTodoCard()

    expect(store.allTodos).toHaveLength(1)
    expect(store.allTodos[0]!.id).toBe(newId)
    expect(store.allTodos[0]!.title).toBe('')
    expect(store.allTodos[0]!.todoList).toEqual([])
  })

  it('находит заметку по ID с помощью геттера getNoteById', () => {
    const store = useTodoStore()
    const id = store.addTodoCard()

    const foundNote = store.getNoteById(id)

    expect(foundNote).toBeDefined()
    expect(foundNote?.id).toBe(id)
  })

  it('сохраняет изменения в существующую заметку и обновляет localStorage', () => {
    const store = useTodoStore()
    const id = store.addTodoCard()

    const noteToUpdate: cardTodo = {
      id,
      title: 'Обновленный заголовок',
      todoList: [{ id: 'task-1', text: 'Купить молоко', done: false }],
      lastUpdate: Date.now(),
    }

    store.saveTodo(noteToUpdate)

    expect(store.allTodos[0]!.title).toBe('Обновленный заголовок')
    expect(store.allTodos[0]!.todoList).toHaveLength(1)

    const savedData = JSON.parse(localStorage.getItem('my_notes_app_data') || '{}')
    expect(savedData.version).toBe(1)
    expect(savedData.todos[0].title).toBe('Обновленный заголовок')
  })

  it('удаляет заметку по ID через deleteTodoCard', () => {
    const store = useTodoStore()
    const id1 = store.addTodoCard()
    const id2 = store.addTodoCard()

    expect(store.allTodos).toHaveLength(2)

    store.deleteTodoCard(id1)

    expect(store.allTodos).toHaveLength(1)
    expect(store.allTodos[0]!.id).toBe(id2)

    const savedData = JSON.parse(localStorage.getItem('my_notes_app_data') || '{}')
    expect(savedData.todos).toHaveLength(1)
  })

  it('правильно рассчитывает totalCompletedCount по всем карточкам', () => {
    const store = useTodoStore()

    store.allTodos = [
      {
        id: '1',
        title: 'Заметка 1',
        todoList: [
          { id: 't1', text: 'Task 1', done: true },
          { id: 't2', text: 'Task 2', done: false },
        ],
        lastUpdate: Date.now(),
      },
      {
        id: '2',
        title: 'Заметка 2',
        todoList: [
          { id: 't3', text: 'Task 3', done: true },
          { id: 't4', text: 'Task 4', done: true },
        ],
        lastUpdate: Date.now(),
      },
    ]

    expect(store.totalCompletedCount).toBe(3)
  })

  describe('initStore (localStorage)', () => {
    it('успешно восстанавливает данные при совпадении версии', () => {
      const mockTodos: cardTodo[] = [
        { id: '100', title: 'Из хранилища', todoList: [], lastUpdate: 12345 },
      ]

      localStorage.setItem('my_notes_app_data', JSON.stringify({ version: 1, todos: mockTodos }))

      const store = useTodoStore()
      store.initStore()

      expect(store.allTodos).toHaveLength(1)
      expect(store.allTodos[0]!.title).toBe('Из хранилища')
    })

    it('сбрасывает данные при устаревшей версии в storage', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      localStorage.setItem(
        'my_notes_app_data',
        JSON.stringify({
          version: 0,
          todos: [{ id: '1', title: 'Старая', todoList: [], lastUpdate: 0 }],
        }),
      )

      const store = useTodoStore()
      store.initStore()

      expect(store.allTodos).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Версия устарела. Выполнен сброс.')
    })
  })
})
