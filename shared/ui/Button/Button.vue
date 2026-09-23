<script setup lang="ts">
import { ButtonVariant, ButtonType } from '@/shared/ui/Button/model/type'

interface Props {
  text?: string
  title?: string
  buttonType?: ButtonType
  variant?: ButtonVariant
  disabled?: boolean
}
withDefaults(defineProps<Props>(), {
  buttonType: ButtonType.Button,
  variant: ButtonVariant.Primary,
  disabled: false,
})
</script>

<template>
  <button
    :class="[variant, { 'has-tooltip': title }]"
    :type="buttonType"
    :data-title="title"
    :aria-label="title"
    :disabled="disabled"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

button {
  font-family: inherit;
  font-size: inherit;
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

  &.primary {
    display: inline-flex;
    align-items: center;
    height: $input-height;
    padding: 12px;
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

  &.secondary {
    flex-shrink: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    margin-left: auto;
    padding: 0;
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

  &.tertiary {
    padding-left: 10px;
    display: flex;
    align-items: center;
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

  &.icon {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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

  &.has-tooltip {
    position: relative;

    &::after {
      content: attr(data-title);
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%) translateY(-4px);

      padding: 4px 8px;
      font-size: 12px;
      line-height: 1.2;
      white-space: nowrap;
      color: $color-black;
      background-color: $color-gray-3;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      opacity: 0;
      visibility: hidden;
      pointer-events: none;

      transition:
        opacity 0.1s ease,
        visibility 0.1s ease;
    }

    &:hover::after {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
