<script setup lang="ts">
import BaseInput from '@/shared/ui/BaseInput.vue'
import CheckBox from '@/shared/ui/CheckBox.vue'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'

const props = defineProps<{
  isEditing?: boolean
  text?: string
  elId?: string
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const textModel = defineModel<string>({ default: '' })

const isDoneModel = defineModel<boolean>('done', { default: false })

function handleDeleteTask() {
  if (props.elId) {
    emit('delete', props.elId)
  }
}
</script>

<template>
  <li class="todo-item">
    <template v-if="isEditing">
      <CheckBox
        :labelShow="false"
        v-model="isDoneModel"
      />
      <BaseInput
        v-model="textModel"
        size="sm"
        :isDone="isDoneModel"
      />
      <Button
        :variant="ButtonVariant.Secondary"
        @click="handleDeleteTask"
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
        :labelText="textModel"
        :labelShow="true"
        :checkBoxDisabled="true"
        v-model="isDoneModel"
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
}
</style>
