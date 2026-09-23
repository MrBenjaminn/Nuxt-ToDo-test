export function useKeybind(onUndo: () => void, onRedo: () => void) {
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    const isEditingText =
      target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

    if (isEditingText) return

    const isCtrlOrCmd = event.ctrlKey || event.metaKey

    if (isCtrlOrCmd && !event.shiftKey && event.key.toLowerCase() === 'z') {
      event.preventDefault()
      onUndo()
    }

    if (
      (isCtrlOrCmd && event.shiftKey && event.key.toLowerCase() === 'z') ||
      (isCtrlOrCmd && event.key.toLowerCase() === 'y')
    ) {
      event.preventDefault()
      onRedo()
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
}
