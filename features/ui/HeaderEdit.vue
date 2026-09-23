<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'
import DeleteMark from '@/shared/icons/delete-mark.svg'
import BaseInput from '@/shared/ui/BaseInput.vue'
import { ButtonVariant } from '@/shared/ui/Button/model/type'

const title = defineModel<string>('text')

const emit = defineEmits<{
  (e: 'deleteNote'): void
}>()
</script>

<template>
  <div class="todo__header">
    <BaseInput
      description="Введите название..."
      size="md"
      v-model="title"
    />
    <Button
      :variant="ButtonVariant.Icon"
      title="Удалить"
      @click="emit('deleteNote')"
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
