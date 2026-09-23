<script setup lang="ts">
import Input from '@/shared/ui/input/Input.vue'
import CheckBox from '@/shared/ui/CheckBox.vue'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'
import { InputSize } from '#shared/ui/input/model/type.ts'

enum emitsActions {
  Delete = 'delete',
  Toggle = 'toggle',
  Blur = 'blur'
}

const props = defineProps<{
  isEditing?: boolean
  done?: boolean
}>()

const emit = defineEmits<{
  (e: emitsActions.Delete): void
  (e: emitsActions.Toggle): void
  (e: emitsActions.Blur): void
}>()

const textModel = defineModel<string>({ default: '' })
const isDoneModel = defineModel<boolean>('done', { default: false })
</script>

<template>
  <li class="todo-item">
    <template v-if="isEditing">
      <CheckBox
        :labelShow="false"
        :modelValue="props.done"
        @update:modelValue="emit(emitsActions.Toggle)"
      />
      <Input
        v-model="textModel"
        :size="InputSize.Small"
        :isDone="isDoneModel"
        @blur="emit(emitsActions.Blur)"
        :class="{ 'inline-edit__input--done': isDoneModel }"
      />
      <Button
        :variant="ButtonVariant.Secondary"
        @click="emit(emitsActions.Delete)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="#757575"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </template>
    <template v-else>
      <CheckBox
        :label="textModel"
        :disabled="true"
        v-model="isDoneModel"
        :class="{ 'todo-item__label--done': isDoneModel }"
      />
    </template>
  </li>
</template>

<style lang="scss" scoped>
$todoListRowGap: 8px;
@use '@/assets/styles/variables' as *;

.todo-item {
  display: flex;
  align-items: center;
  column-gap: 12px;
  padding-left: 10px;
  border: $border;
  border-radius: $border-radius;
  transition-duration: $transition-duration;
  height: 45px;

  &:hover{
    background-color: $color-gray-1;
  }

  &.is-disappearing {
    opacity: 0;
    translate: 0 -75%;
    transition-duration: calc($transition-duration * 2);
    pointer-events: none;

    & ~ .todo-item {
      translate: 0 calc((100% + $todoListRowGap) * -1);
      transition-delay: $transition-duration;
      transition-duration: $transition-duration;
      pointer-events: none;
    }
  }

  &__label--done {
    :deep(.item-checkbox__label) {
      color: $color-gray-4;
      text-decoration: line-through;
    }
  }
}

.todo-item__label--done {
  :deep(.item-checkbox__label) {
    text-decoration: line-through;
    color: $color-gray-4;
  }
}
</style>
