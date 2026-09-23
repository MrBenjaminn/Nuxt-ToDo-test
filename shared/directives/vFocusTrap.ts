import type { Directive, DirectiveBinding } from 'vue'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface TrapElement extends HTMLElement {
  _handleTrapKeyDown?: (e: KeyboardEvent) => void
}

function initFocusTrap(el: TrapElement, enabled: boolean = true) {
  removeFocusTrap(el)

  if (enabled === false) return

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const focusables = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))

    if (focusables.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusables[0]
    const lastElement = focusables[focusables.length - 1]

    if (!firstElement || !lastElement) return

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  el._handleTrapKeyDown = handleKeyDown
  el.addEventListener('keydown', handleKeyDown)

  const firstFocusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)[0]
  if (firstFocusable && !el.contains(document.activeElement)) {
    firstFocusable.focus()
  }
}

function removeFocusTrap(el: TrapElement) {
  if (el._handleTrapKeyDown) {
    el.removeEventListener('keydown', el._handleTrapKeyDown)
    delete el._handleTrapKeyDown
  }
}

export const vFocusTrap: Directive = {
  mounted(el: TrapElement, binding: DirectiveBinding<boolean>) {
    initFocusTrap(el, binding.value)
  },

  updated(el: TrapElement, binding: DirectiveBinding<boolean>) {
    if (binding.value !== binding.oldValue) {
      initFocusTrap(el, binding.value)
    }
  },

  unmounted(el: TrapElement) {
    removeFocusTrap(el)
  },
}
