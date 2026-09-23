import { safeClone } from '@/shared/lib/cloneObj'
import { ref, computed, watch, nextTick, type Ref } from 'vue'

export function useHistory<T>(
  targetRef: Ref<T | null | undefined>,
  storageKey?: string,
  maxSteps = 50,
  debounceMs = 500,
) {
  const history = ref<T[]>([]) as Ref<T[]>
  const redoStack = ref<T[]>([]) as Ref<T[]>
  let isUndoingOrRedoing = false

  let lastState: T | null = targetRef.value ? safeClone(targetRef.value) : null
  let pendingState: T | null = null
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  if (storageKey && import.meta.client) {
    const savedHistory = sessionStorage.getItem(`${storageKey}_history`)
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        if (Array.isArray(parsed.history) && Array.isArray(parsed.redoStack)) {
          history.value = parsed.history
          redoStack.value = parsed.redoStack
        }
      } catch (e) {
        console.error('Ошибка чтения истории из sessionStorage:', e)
      }
    }
  }

  function saveHistoryToStorage() {
    if (!storageKey || !import.meta.client) return

    const dataToSave = {
      history: history.value,
      redoStack: redoStack.value,
    }
    sessionStorage.setItem(`${storageKey}_history`, JSON.stringify(dataToSave))
  }

  function pushToHistory(state: T) {
    const lastHistoryState = history.value[history.value.length - 1]

    if (lastHistoryState && JSON.stringify(lastHistoryState) === JSON.stringify(state)) {
      return
    }

    if (history.value.length >= maxSteps) {
      history.value.shift()
    }
    history.value.push(safeClone(state))
    redoStack.value = []

    saveHistoryToStorage()
  }

  function commit() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    if (isUndoingOrRedoing) return

    if (pendingState !== null) {
      pushToHistory(pendingState)
      pendingState = null
    }

    if (targetRef.value) {
      lastState = safeClone(targetRef.value)
    }
  }

  watch(
    () => targetRef.value,
    (newVal) => {
      if (isUndoingOrRedoing || !newVal) return

      if (!lastState) {
        lastState = safeClone(newVal)
        return
      }

      if (pendingState === null) {
        pendingState = safeClone(lastState)
      }

      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(() => {
        commit()
      }, debounceMs)
    },
    { deep: true },
  )

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  function undo() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    if (history.value.length === 0 || !targetRef.value) return

    isUndoingOrRedoing = true

    const currentState = safeClone(targetRef.value)
    redoStack.value.push(currentState)

    const previousState = history.value.pop()!

    targetRef.value = safeClone(previousState)
    lastState = safeClone(previousState)
    pendingState = null

    saveHistoryToStorage()

    nextTick(() => {
      isUndoingOrRedoing = false
    })
  }

  function redo() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    pendingState = null

    if (redoStack.value.length === 0 || !targetRef.value) return

    isUndoingOrRedoing = true

    const currentState = safeClone(targetRef.value)
    history.value.push(currentState)

    const nextState = redoStack.value.pop()!

    targetRef.value = safeClone(nextState)
    lastState = safeClone(nextState)

    saveHistoryToStorage()

    nextTick(() => {
      isUndoingOrRedoing = false
    })
  }

  function handleBlur() {
    commit()
  }

  function recordAtomic(mutationFn: () => void) {
    if (debounceTimer || pendingState !== null) {
      commit()
    }

    if (targetRef.value) {
      pushToHistory(safeClone(targetRef.value))
    }

    isUndoingOrRedoing = true

    mutationFn()

    if (targetRef.value) {
      lastState = safeClone(targetRef.value)
    }

    nextTick(() => {
      isUndoingOrRedoing = false
    })
  }

  function clearHistory() {
    history.value = []
    redoStack.value = []
    pendingState = null
    if (debounceTimer) clearTimeout(debounceTimer)
    if (storageKey && import.meta.client) {
      sessionStorage.removeItem(`${storageKey}_history`)
    }
  }

  const canUndo = computed(() => history.value.length > 0 || pendingState !== null)
  const canRedo = computed(() => redoStack.value.length > 0)

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    handleBlur,
    recordAtomic,
    clearHistory,
  }
}
