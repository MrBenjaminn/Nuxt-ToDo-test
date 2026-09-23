<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
}>()

const isChecked = defineModel<boolean>({ default: false })
const uniqueId = useId()
</script>

<template>
  <div class="item-checkbox" :class="{ 'item-checkbox--disabled': disabled }">
    <input
      class="item-checkbox__input"
      :id="uniqueId"
      type="checkbox"
      :disabled="disabled"
      v-model="isChecked"
    />
    <label
      v-if="label || $slots.default"
      class="item-checkbox__label"
      :for="uniqueId"
    >
      <slot>
        {{ label }}
      </slot>
    </label>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.item-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &--disabled {

    .item-checkbox__input {
      cursor: not-allowed;
    }
    .item-checkbox__label {
      cursor: default;
    }
  }

  &__input {
    flex-shrink: 0;
    appearance: none;
    position: relative;
    width: 20px;
    height: 20px;
    margin: 0;
    border: 1px solid $color-gray-4;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;

    &:focus-visible {
      outline: 2px solid $color-dark-2;
      outline-offset: 2px;
    }

    &:checked {
      background-color: $color-dark-2;
      border-color: $color-dark-2;

      &::after {
        opacity: 1;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      width: 14px;
      height: 14px;
      background: url('../icons/icon-check_white.svg') center/contain no-repeat;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
  }

  &__label {
    cursor: pointer;
    user-select: none;
  }
}
</style>
