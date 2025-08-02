<template>
  <div class="stats-card">
    <h3>📊 Estatísticas dos Filtros</h3>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Total de Jogos:</span>
        <span class="stat-value">{{ totalGames }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Jogos Filtrados:</span>
        <span class="stat-value">{{ filteredCount }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Gêneros Selecionados:</span>
        <span class="stat-value">{{ selectedGenres.length || 'Nenhum' }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Plataforma:</span>
        <span class="stat-value">{{ platformLabel }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">RAM Mínima:</span>
        <span class="stat-value">{{ ramGB }} GB</span>
      </div>
    </div>

    <div v-if="filteredCount > 0" class="stats-actions">
      <button @click="$emit('findAnother')" class="btn btn-secondary">
        🎲 Jogo Aleatório
      </button>
      <button @click="$emit('reset')" class="btn btn-secondary">
        Limpar Filtros
      </button>
    </div>

    <div v-else-if="hasSearched" class="no-results">
      <p>Nenhum jogo encontrado com os filtros atuais.</p>
      <p>Tente ajustar os critérios para encontrar mais opções.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalGames: number
  filteredCount: number
  selectedGenres: string[]
  platform: string
  ramGB: number
  hasSearched: boolean
}

const props = defineProps<Props>()

defineEmits<{
  findAnother: []
  reset: []
}>()

const platformLabel = computed(() => {
  switch (props.platform) {
    case 'pc': return 'PC'
    case 'browser': return 'Navegador'
    case 'all': return 'Todas'
    default: return props.platform
  }
})
</script>

<style scoped>
.stats-card {
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--background);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--text-primary);
}

.stats-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.no-results {
  text-align: center;
  color: var(--text-secondary);
  margin-top: 1rem;
}

.no-results p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-actions {
    flex-direction: column;
  }
}
</style>
