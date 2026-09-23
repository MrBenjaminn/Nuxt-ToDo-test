<script setup lang="ts">
import Input from '@/shared/ui/input/Input.vue'
import CheckBox from '@/shared/ui/CheckBox.vue'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'
import { InputSize } from '@/shared/ui/input/model/type'
import SmallDeleteMark from '@/shared/icons/small-delete-mark.svg?component'

defineProps<{
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'toggle'): void
  (e: 'blur'): void
}>()

const textModel = defineModel<string>({ default: '' })
const isDoneModel = defineModel<boolean>('done', { default: false })
</script>

<template>
  <li class="todo-item">
    <template v-if="isEditing">
      <CheckBox
        :labelShow="false"
        :modelValue="isDoneModel"
        @update:modelValue="emit('toggle')"
      />
      <Input
        v-model="textModel"
        :size="InputSize.Small"
        :isDone="isDoneModel"
        @blur="emit('blur')"
        :class="{ 'inline-edit__input--done': isDoneModel }"
      />
      <Button
        :variant="ButtonVariant.Secondary"
        :aria-label="'Удалить задачу'"
        @click="emit('delete')"
      >
        <SmallDeleteMark />
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

  &:hover {
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
</style>
