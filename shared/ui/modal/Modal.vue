<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { vFocusTrap } from '@/shared/directives/vFocusTrap'
import SmallDeleteMark from '@/shared/icons/small-delete-mark.svg?component'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonType, ButtonVariant } from '@/shared/ui/Button/model/type'

interface Props {
  title?: string
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  ariaLabel: 'Модальное окно',
})

const isOpen = defineModel<boolean>('isOpen', { required: true })
const emit = defineEmits<{ (e: 'close'): void }>()

const dialogRef = ref<HTMLDialogElement | null>(null)

function closeModal() {
  isOpen.value = false
  emit('close')
}

function handleDialogClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    closeModal()
  }
}

watch(
  isOpen,
  (val) => {
    if (!dialogRef.value) return
    if (val) {
      if (!dialogRef.value.open) dialogRef.value.showModal()
    } else {
      if (dialogRef.value.open) dialogRef.value.close()
    }
  },
  { immediate: true },
)

function handleNativeCancel(event: Event) {
  event.preventDefault()
  closeModal()
}

onMounted(() => {
  if (isOpen.value && dialogRef.value && !dialogRef.value.open) {
    dialogRef.value.showModal()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal-fade"
      v-focus-trap
    >
      <dialog
        v-if="isOpen"
        ref="dialogRef"
        class="modal-window"
        :aria-label="title || ariaLabel"
        @cancel="handleNativeCancel"
        @click="handleDialogClick"
      >
        <header
          v-if="title || $slots.header"
          class="modal-window__header"
        >
          <slot name="header">
            <h3 class="modal-window__title">{{ title }}</h3>
          </slot>
          <Button
            :type="ButtonType.Button"
            :variant="ButtonVariant.Icon"
            :aria-label="'Закрыть модальное окно'"
            @click="closeModal"
          >
            <SmallDeleteMark />
          </Button>
        </header>

        <div class="modal-window__body">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="modal-window__footer"
        >
          <slot name="footer" />
        </footer>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.modal-window {
  padding: 0;
  border: none;
  background-color: $color-gray-1;
  border-radius: $border-radius;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: calc(100% - 32px);
  max-width: 480px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $color-gray-2;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: $color-dark-2;
  }

  &__close-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    line-height: 1;
    color: $color-gray-4;
    cursor: pointer;
    padding: 0 4px;
    border-radius: 4px;
    transition:
      color 0.2s,
      background-color 0.2s;

    &:hover {
      color: $color-dark-2;
      background-color: $color-gray-2;
    }

    &:focus-visible {
      outline: 2px solid $color-dark-2;
    }
  }

  &__body {
    padding: 20px;
    overflow-y: auto;
    font-size: 15px;
    color: $color-dark-2;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 12px 20px;
    border-top: 1px solid $color-gray-2;
    background-color: $color-gray-1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
