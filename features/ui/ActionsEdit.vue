<script setup lang="ts">
import UndoRedoArrow from '@/shared/icons/undo-redo-arrow.svg'
import BackArrow from '@/shared/icons/back-arrow.svg'
import Save from '@/shared/icons/save.svg'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'

enum ButtonActions {
  Back = 'назад',
  Undo = 'отменить',
  Redo = 'повторить',
  Save = 'сохранить',
}

defineEmits<{
  (e: 'save'): void
  (e: 'redo'): void
  (e: 'undo'): void
}>()

const props = withDefaults(
  defineProps<{
    canUndo?: boolean
    canRedo?: boolean
  }>(),
  {
    canUndo: false,
    canRedo: false,
  }
)

async function backMain() {
  await navigateTo('/')
}
</script>

<template>
  <div class="todo__actions">
    <Button
      :variant="ButtonVariant.Icon"
      :title="ButtonActions.Back"
      @click="backMain"
    >
      <BackArrow />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      :title="ButtonActions.Undo"
      :disabled="!props.canUndo"
      @click="$emit('undo')"
    >
      <UndoRedoArrow class="undo" />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      :title="ButtonActions.Redo"
      :disabled="!props.canRedo"
      @click="$emit('redo')"
    >
      <UndoRedoArrow class="redo" />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      :title="ButtonActions.Save"
      @click="$emit('save')"
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
}

.undo {
  transform: scaleX(-1);
}
</style>
