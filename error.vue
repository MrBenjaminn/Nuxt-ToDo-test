<script setup lang="ts">
import type { NuxtError } from '#app'
import { ButtonType, ButtonVariant } from '#shared/ui/Button/model/type.ts'
import Button from '#shared/ui/Button/Button.vue'

defineProps<{
  error: NuxtError
}>()

const handleClearError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="custom-error-page">
    <div class="custom-error-page__content">
      <h1 class="custom-error-page__code">{{ error.statusCode || 404 }}</h1>
      <h2 class="custom-error-page__title">
        {{ error.statusMessage || 'Страница не найдена' }}
      </h2>
      <p class="custom-error-page__description">
        К сожалению, запрашиваемая страница не существует или была удалена.
      </p>

      <Button
        :variant="ButtonVariant.Primary"
        text="Вернуться на главную"
        :buttonType="ButtonType.Button"
        @click="handleClearError"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.custom-error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: $color-gray-1;
  color: $color-dark-2;

  &__content {
    text-align: center;
    max-width: 480px;
  }

  &__code {
    font-size: 96px;
    font-weight: 800;
    line-height: 1;
    margin: 0 0 16px;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 12px;
  }

  &__description {
    font-size: 16px;
    color: $color-gray-4;
    margin: 0 0 24px;
  }
}
</style>
