function safeClone<T>(val: T): T {
  if (!val) return val
  return JSON.parse(JSON.stringify(val))
}

export function useHistory<T>(
  targetRef: Ref<T | null | undefined>,
  maxSteps = 50,
  debounceMs = 500,
) {
  const history = ref<T[]>([]) as Ref<T[]>
  const redoStack = ref<T[]>([]) as Ref<T[]>
  let isUndoingOrRedoing = false

  let lastState: T | null = targetRef.value ? safeClone(targetRef.value) : null
  let pendingState: T | null = null
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function commitPendingState() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    if (pendingState !== null) {
      if (history.value.length >= maxSteps) {
        history.value.shift()
      }
      history.value.push(pendingState)
      redoStack.value = []
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

      if (!debounceTimer && pendingState === null) {
        pendingState = safeClone(lastState)
      }

      if (debounceTimer) clearTimeout(debounceTimer)

      debounceTimer = setTimeout(() => {
        commitPendingState()
      }, debounceMs)
    },
    { deep: true },
  )

  function undo() {
    if (pendingState !== null) {
      commitPendingState()
    }

    if (history.value.length === 0 || !targetRef.value) return

    isUndoingOrRedoing = true

    const currentState = safeClone(targetRef.value)
    redoStack.value.push(currentState)

    const previousState = history.value.pop()!

    targetRef.value = safeClone(previousState)
    lastState = safeClone(previousState)

    nextTick(() => {
      isUndoingOrRedoing = false
    })
  }

  function redo() {
    if (pendingState !== null) {
      commitPendingState()
    }

    if (redoStack.value.length === 0 || !targetRef.value) return

    isUndoingOrRedoing = true

    const currentState = safeClone(targetRef.value)
    history.value.push(currentState)

    const nextState = redoStack.value.pop()!

    targetRef.value = safeClone(nextState)
    lastState = safeClone(nextState)

    nextTick(() => {
      isUndoingOrRedoing = false
    })
  }

  function recordState(newState: T) {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
      pendingState = null
    }

    if (isUndoingOrRedoing) return

    const snapshot = safeClone(newState)

    if (history.value.length >= maxSteps) {
      history.value.shift()
    }

    history.value.push(snapshot)
    redoStack.value = []
    lastState = snapshot
  }

  const canUndo = computed(() => history.value.length > 0 || pendingState !== null)
  const canRedo = computed(() => redoStack.value.length > 0)

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    recordState,
  }
}
