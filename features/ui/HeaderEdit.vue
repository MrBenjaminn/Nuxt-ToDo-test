<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'
import DeleteMark from '@/shared/icons/delete-mark.svg'
import Input from '@/shared/ui/input/Input.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'
import { InputSize } from '@/shared/ui/input/model/type'
import { vTooltip } from '@/shared/directives/vTooltip'

const title = defineModel<string>()

const emit = defineEmits<{
  (e: 'deleteNote'): void
  (e: 'blur'): void
}>()
</script>

<template>
  <div class="todo__header">
    <Input
      placeholder="Введите название..."
      :size="InputSize.Medium"
      v-model="title"
      @blur="emit('blur')"
    />
    <Button
      :variant="ButtonVariant.Icon"
      @click="emit('deleteNote')"
      v-tooltip="'Удалить'"
      ariaLabel="Удалить заметку"
    >
      <DeleteMark />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.todo__header {
  display: flex;
  align-items: center;
}
</style>
