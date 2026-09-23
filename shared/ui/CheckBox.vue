<script setup lang="ts">
defineProps<{
  labelText?: string
  labelShow?: boolean
  checkBoxDisabled?: boolean
}>()

const isChecked = defineModel<boolean>({ default: false })
</script>

<template>
  <input
    class="todo-item__checkbox"
    id="checkbox"
    type="checkbox"
    :disabled="checkBoxDisabled"
    v-model="isChecked"
  />
  <label
    class="todo-item__label"
    for="checkbox"
    v-show="labelShow"
  >
    {{ labelText }}
  </label>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.todo-item__checkbox {
  flex-shrink: 0;
  appearance: none;
  position: relative;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 1px solid $color-gray-4;
  border-radius: 4px;

  &:checked {
    background-color: $color-dark-2;
    border-color: $color-dark-2;

    & + .todo-item__label {
      color: $color-gray-4;
      text-decoration: line-through;
    }
  }

  &:not(:checked) {
    &::after {
      opacity: 0;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    width: 16px;
    height: 16px;
    background: url('../icons/icon-check_white.svg') center/contain no-repeat;
  }
}

.todo-item__label {
  width: 100%;
  pointer-events: none;
}
</style>
