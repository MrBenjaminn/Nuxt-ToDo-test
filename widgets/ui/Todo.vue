<script setup></script>

<template>
  <div class="todo">
    <header class="todo__header">
      <slot name="header" />
    </header>
    <main class="todo__body">
      <slot />
    </main>
    <footer class="todo__actions">
      <slot name="actions" />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.todo__actions {
  margin-top: auto;
  justify-content: space-between;
  display: flex;
}

.todo {
  display: flex;
  flex-direction: column;
  row-gap: 18px;
  width: 100%;
  max-width: 404px;
  min-height: 429px;
  padding: 24px;
  background-color: $color-white;
  border: $border;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  margin: 40px auto;
}

.todo__title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.todo__header {
  display: flex;
  flex-direction: column;
  row-gap: 14px;
}
</style>
