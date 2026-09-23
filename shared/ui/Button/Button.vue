<script setup lang="ts">
import { ButtonVariant, ButtonType, ButtonSize } from '@/shared/ui/Button/model/type'
import { computed } from 'vue'

interface Props {
  text?: string
  buttonType?: ButtonType
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  ariaLabel?: string
}
const props = withDefaults(defineProps<Props>(), {
  buttonType: ButtonType.Button,
  variant: ButtonVariant.Primary,
  size: ButtonSize.Medium,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--size-${props.size}`,
])

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :type="buttonType"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease,
    opacity 0.2s ease;

  &:focus-visible {
    outline: 2px solid $color-dark-2;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--size-md {
    height: $input-height;
    padding: 14px;
    border-radius: $border-radius;
  }

  &--size-bg {
    height: 50px;
    padding: 0 10px;
    border-radius: $border-radius;
  }

  &--primary {
    color: $color-gray-1;
    background-color: $color-dark-2;
    border: 1px solid $color-dark-2;
    border-radius: $border-radius;

    &:hover:not(:disabled) {
      color: $color-dark-2;
      background-color: transparent;
    }

    &:active:not(:disabled) {
      transform: scale(1.05);
    }
  }

  &--secondary {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    margin-left: auto;
    color: $color-gray-4;
    background-color: transparent;
    border: none;
    border-radius: inherit;

    &:hover {
      color: $color-white;
      background-color: $color-dark-1;
    }

    &:active {
      transform: scale(1.05);
    }

    * {
      pointer-events: none;
    }
  }

  &--tertiary {
    padding-left: 10px;
    column-gap: 20px;
    width: fit-content;
    background: transparent;
    border: none;
    color: $color-gray-4;

    &:hover {
      color: $color-dark-2;
      border-radius: $border-radius;
    }
  }

  &--icon {
    padding: 0;
    column-gap: 20px;
    background: transparent;
    border: none;
    height: 30px;
    width: 30px;
    border-radius: 50%;

    &:hover {
      background-color: $color-gray-2;
      transform: scale(1.05);
    }
  }
}
</style>
