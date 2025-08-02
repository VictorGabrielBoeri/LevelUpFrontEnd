<template>
  <div class="loading-container">
    <div class="spinner-container">
      <div class="spinner"></div>
      <div class="spinner-ring"></div>
    </div>
    <p class="loading-text">{{ message || 'Carregando...' }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.spinner-container {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-top: 3px solid var(--primary-hover);
  border-radius: 50%;
  animation: spin 1.5s linear infinite reverse;
}

.loading-text {
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
