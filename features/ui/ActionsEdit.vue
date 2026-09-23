<script setup lang="ts">
import UndoRedoArrow from '@/shared/icons/undo-redo-arrow.svg'
import BackArrow from '@/shared/icons/back-arrow.svg'
import Save from '@/shared/icons/save.svg'
import Button from '@/shared/ui/Button/Button.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'
import { vTooltip } from '@/shared/directives/vTooltip'

const InfoButtons = {
  Back: 'назад',
  Undo: 'отменить',
  Redo: 'повторить',
  Save: 'сохранить',
} as const

const emit = defineEmits<{
  back:[]
  save:[]
  redo:[]
  undo:[]
}>()

function onBack() {
  emit('back')
}

function onUndo() {
  emit('undo')
}

function onRedo() {
  emit('redo')
}

function onSave() {
  emit('save')
}

withDefaults(
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
      v-tooltip="InfoButtons.Back"
      @click="onBack"
      :aria-label="InfoButtons.Back"
    >
      <BackArrow />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      v-tooltip="InfoButtons.Undo"
      :disabled="!canUndo"
      @click="onUndo"
      :aria-label="InfoButtons.Undo"
    >
      <UndoRedoArrow class="undo" />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      v-tooltip="InfoButtons.Redo"
      :disabled="!canRedo"
      @click="onRedo"
      :aria-label="InfoButtons.Redo"
    >
      <UndoRedoArrow />
    </Button>

    <Button
      :variant="ButtonVariant.Icon"
      v-tooltip="InfoButtons.Save"
      @click="onSave"
      :aria-label="InfoButtons.Save"
    >
      <Save />
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
