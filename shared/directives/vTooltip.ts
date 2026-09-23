import type { Directive } from 'vue'

export const vTooltip: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    if (!binding.value) return
    el.setAttribute('data-tooltip', binding.value)
    el.classList.add('with-tooltip')
  },
  updated(el, binding) {
    if (binding.value) {
      el.setAttribute('data-tooltip', binding.value)
    } else {
      el.removeAttribute('data-tooltip')
      el.classList.remove('with-tooltip')
    }
  },
  unmounted(el) {
    el.removeAttribute('data-tooltip')
    el.classList.remove('with-tooltip')
  },
}
