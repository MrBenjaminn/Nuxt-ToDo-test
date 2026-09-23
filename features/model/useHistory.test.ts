import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useHistory } from './useHistory'

describe('useHistory composable', () => {
  it('инициализируется с пустыми стеками истории', () => {
    const target = ref({ title: 'Test', items: [] })
    const { canUndo, canRedo } = useHistory(target)

    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })

  it('сохраняет текст по дебаунсу', async () => {
    const target = ref({ title: 'Draft', items: [] })
    const { canUndo } = useHistory(target, '', 50, 30)

    target.value = { title: 'Updated text', items: [] }

    expect(canUndo.value).toBe(false)

    await new Promise((resolve) => setTimeout(resolve, 40))

    expect(canUndo.value).toBe(true)
  })

  it('корректно выполняет recordAtomic, undo и redo', () => {
    const target = ref({ title: 'Note', items: ['Task 1'] })
    const { undo, redo, canUndo, canRedo, recordAtomic } = useHistory(target)

    recordAtomic(() => {
      target.value = { title: 'Note', items: ['Task 1', 'Task 2'] }
    })

    expect(canUndo.value).toBe(true)
    expect(target.value.items.length).toBe(2)

    undo()
    expect(target.value.items.length).toBe(1)
    expect(canRedo.value).toBe(true)

    redo()
    expect(target.value.items.length).toBe(2)
    expect(canRedo.value).toBe(false)
  })

  it('сбрасывает redo-стек при новой атомарной мутации', () => {
    const target = ref({ title: 'A', items: [] })
    const { undo, canRedo, recordAtomic } = useHistory(target)

    recordAtomic(() => {
      target.value = { title: 'B', items: [] }
    })

    undo()
    expect(canRedo.value).toBe(true)

    recordAtomic(() => {
      target.value = { title: 'C (Branch)', items: [] }
    })

    expect(canRedo.value).toBe(false)
  })
})
