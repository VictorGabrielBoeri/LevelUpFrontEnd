<template>
  <div class="game-card" :data-game-id="game.id">
    <div style="display: flex; gap: 1rem; align-items: start;">
      <img
        :src="game.thumbnail"
        :alt="game.title"
        style="width: 120px; height: 90px; object-fit: cover; border-radius: 8px;"
      />
      <div style="flex: 1;">
        <h3 class="game-title">{{ game.title }}</h3>
        <p class="game-description">{{ game.short_description }}</p>

        <div class="game-meta">
          <span class="game-tag">{{ game.genre }}</span>
          <span class="game-tag">{{ game.platform }}</span>
          <span class="game-tag">{{ game.publisher }}</span>
        </div>

        <!-- Requisitos mínimos se disponíveis -->
        <div v-if="game.minimum_system_requirements" class="requirements">
          <h4 style="margin: 1rem 0 0.5rem 0; color: var(--text-secondary);">Requisitos Mínimos:</h4>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">
            <div v-if="game.minimum_system_requirements.os">
              <strong>OS:</strong> {{ game.minimum_system_requirements.os }}
            </div>
            <div v-if="game.minimum_system_requirements.processor">
              <strong>Processador:</strong> {{ game.minimum_system_requirements.processor }}
            </div>
            <div v-if="game.minimum_system_requirements.memory">
              <strong>Memória:</strong> {{ game.minimum_system_requirements.memory }}
            </div>
            <div v-if="game.minimum_system_requirements.graphics">
              <strong>Placa de Vídeo:</strong> {{ game.minimum_system_requirements.graphics }}
            </div>
            <div v-if="game.minimum_system_requirements.storage">
              <strong>Armazenamento:</strong> {{ game.minimum_system_requirements.storage }}
            </div>
          </div>
        </div>

        <div style="margin-top: 1rem;">
          <a
            :href="game.game_url"
            target="_blank"
            class="btn btn-primary"
          >
            Jogar Agora
          </a>
          <a
            :href="game.freetogame_profile_url"
            target="_blank"
            class="btn btn-secondary"
            style="margin-left: 0.5rem;"
          >
            Ver Detalhes
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '@/stores/gameStore'

interface Props {
  game: Game
}

defineProps<Props>()
</script>
