<script setup lang="ts">
type InputSize = 'sm' | 'md'

interface Props {
  description?: string
  size?: InputSize
  isDone?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  description: '',
  isDone: false,
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <input
      type="text"
      :class="[
        'inline-edit__input',
        `inline-edit__input--${size}`,
        { 'inline-edit__input--done': isDone },
      ]"
      :placeholder="description"
      v-model="model"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.inline-edit {
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

    &--sm {
      font-size: 16px;
      font-weight: 400;
    }

    &--md {
      font-size: 24px;
      font-weight: 600;
    }

    &--done {
      color: $color-gray-4;
      text-decoration: line-through;
    }
  }
}
</style>
