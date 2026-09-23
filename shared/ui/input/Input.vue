<script setup lang="ts">
import { InputSize } from '@/shared/ui/input/model/type.ts'

defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<{
  placeholder?: string
  size?: InputSize
}>(), {
  size: InputSize.Medium,
  placeholder: '',
})

const model = defineModel<string>({
  default: '',
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

function onBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>

<template>
  <input
    v-bind="$attrs"
    type="text"
    :class="['inline-edit__input', `inline-edit__input--${size}`]"
    :placeholder="placeholder"
    v-model="model"
    @blur="onBlur"
  />
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.inline-edit {
  width: 100%;

  &__input {
    line-height: 1.2;
    width: 100%;
    color: #333;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 4px 8px;
    outline: none;
    transition:
      border-color 0.2s,
      background-color 0.2s;

    &--done {
      text-decoration: line-through;
      color: $color-gray-4;
    }

    &:focus {
      border-color: $color-gray-4;
      background-color: #fff;
    }

    &--sm {
      font-size: 16px;
      font-weight: 400;
    }

    &--md {
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>
