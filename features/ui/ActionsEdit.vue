<script setup lang="ts">
import UndoRedoArrow from '@/shared/icons/undo-redo-arrow.svg'
import BackArrow from '@/shared/icons/back-arrow.svg'
import Save from '@/shared/icons/save.svg'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'

enum InfoButtonActions {
  Back = 'назад',
  Undo = 'отменить',
  Redo = 'повторить',
  Save = 'сохранить',
}

enum ButtonActions {
  Back = 'back',
  Save = 'save',
  Redo = 'redo',
  Undo = 'undo',
}

const emit = defineEmits<{
  (e: ButtonActions.Back): void
  (e: ButtonActions.Save): void
  (e: ButtonActions.Redo): void
  (e: ButtonActions.Undo): void
}>()

const props = withDefaults(
  defineProps<{
    canUndo?: boolean
    canRedo?: boolean
  }>(),
  {
    canUndo: false,
    canRedo: false,
  },
)
</script>

<template>
  <div class="todo__actions">
    <Button
      :variant="ButtonVariant.Icon"
      :title="InfoButtonActions.Back"
      @click="emit(ButtonActions.Back)"
    >
      <BackArrow />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      :title="InfoButtonActions.Undo"
      :disabled="!props.canUndo"
      @click="$emit(ButtonActions.Undo)"
    >
      <UndoRedoArrow class="undo" />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      :title="InfoButtonActions.Redo"
      :disabled="!props.canRedo"
      @click="$emit(ButtonActions.Redo)"
    >
      <UndoRedoArrow class="redo" />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      :title="InfoButtonActions.Save"
      @click="$emit(ButtonActions.Save)"
    >
      <Save class="redo" />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.todo__actions {
  display: flex;
  justify-content: start;
  column-gap: 10px;
  margin: auto auto 0;

  .undo {
    transform: scaleX(-1);
  }
}
</style>
