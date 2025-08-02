<template>
  <div>
    <!-- Filtros de Jogos -->
    <section class="section">
      <h2 class="section-title">🔍 Filtros de Jogos</h2>

      <div class="filters-card">
        <div class="filters-grid">
          <!-- Gêneros -->
          <div class="form-group">
            <label class="form-label">Gêneros de Jogos</label>
            <div class="genres-container">
              <div class="genres-grid">
                <label v-for="genre in availableGenres" :key="genre" class="genre-item">
                  <input
                    type="checkbox"
                    :value="genre"
                    v-model="selectedGenres"
                    class="genre-checkbox"
                  />
                  <span class="genre-label">{{ genre }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Plataforma e RAM lado a lado -->
          <div class="filters-row">
            <div class="filters-grid">
              <!-- Plataforma -->
              <div class="form-group">
                <label class="form-label">Plataforma</label>
                <select v-model="selectedPlatform" class="form-input">
                  <option value="all">Todas as plataformas</option>
                  <option value="pc">PC</option>
                  <option value="browser">Navegador</option>
                </select>
              </div>

              <!-- RAM -->
              <div class="form-group">
                <label class="form-label">Memória RAM disponível (GB)</label>
                <input
                  type="number"
                  v-model="selectedRAM"
                  min="1"
                  max="64"
                  class="form-input"
                  placeholder="Ex: 8"
                />
              </div>

              <!-- Botões -->
              <div class="form-group">
                <div style="display: flex; gap: 1rem; margin-top: 2rem">
                  <button @click="findGames" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Buscando...' : hasSearched ? 'Atualizar Busca' : 'Buscar Jogos' }}
                  </button>
                  <button @click="resetFilters" class="btn btn-secondary">Limpar Filtros</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Jogos Filtrados -->
    <section v-if="filteredGames.length > 0" class="section">
      <h2 class="section-title">🎯 Jogos Encontrados ({{ filteredGames.length }})</h2>

      <!-- Controles da lista -->
      <div
        class="btns-container"
        style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap"
      >
        <button @click="selectRandomGame" class="btn btn-primary">🎲 Jogo Aleatório</button>
        <button @click="shuffleGames" class="btn btn-secondary">🔀 Embaralhar Lista</button>
        <select v-model="sortBy" class="form-input select-width" style="max-width: 200px">
          <option value="title">Ordenar por Nome</option>
          <option value="genre">Ordenar por Gênero</option>
          <option value="platform">Ordenar por Plataforma</option>
        </select>

        <!-- Controle de itens por página -->
        <select v-model="itemsPerPage" class="form-input select-width" style="max-width: 150px">
          <option value="6">6 por página</option>
          <option value="12">12 por página</option>
          <option value="24">24 por página</option>
          <option value="48">48 por página</option>
        </select>
      </div>

      <!-- Lista de jogos filtrados -->
      <div class="games-grid">
        <div
          v-for="game in paginatedGames"
          :key="game.id"
          class="game-card large"
          :data-game-id="game.id"
        >
          <div style="position: relative">
            <img :src="game.thumbnail" :alt="game.title" class="game-image large" />
          </div>

          <div class="game-info">
            <h3 class="game-title large" style="margin-bottom: 1rem; color: var(--text-primary);">
              {{ game.title }}
            </h3>

            <div class="game-meta">
              <span class="game-tag">{{ game.genre }}</span>
              <span class="game-tag">{{ game.platform }}</span>
              <span class="game-tag">{{ game.publisher }}</span>
            </div>

            <p class="game-description">{{ game.short_description }}</p>

            <div style="margin-top: 1rem">
              <a :href="game.game_url" target="_blank" class="btn btn-primary"> Jogar Agora </a>
              <a
                :href="game.freetogame_profile_url"
                target="_blank"
                class="btn btn-secondary"
                style="margin-left: 0.5rem"
              >
                Ver Detalhes
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ sortedGames.length }} jogos
        </div>

        <div class="pagination-controls">
          <button
            @click="goToPage(currentPage - 1)"
            class="btn btn-secondary"
            :disabled="currentPage === 1"
          >
            ‹ Anterior
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="page-btn"
              :class="{ active: page === currentPage }"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            class="btn btn-secondary"
            :disabled="currentPage === totalPages"
          >
            Próximo ›
          </button>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Carregando jogos..." />

    <!-- Erro -->
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Nenhum jogo encontrado -->
    <div
      v-if="!loading && !error && filteredGames.length === 0 && (hasSearched || hasActiveSearch || hasActiveFilters)"
      class="alert alert-info"
    >
      <h3 v-if="hasActiveSearch">
        Nenhum jogo foi encontrado com a pesquisa "{{ searchQuery }}"
      </h3>
      <h3 v-else>Nenhum jogo encontrado</h3>

      <p v-if="hasActiveSearch">
        Tente ajustar os termos de busca ou usar filtros diferentes:
      </p>
      <p v-else>
        Tente ajustar os filtros para encontrar mais opções:
      </p>

      <ul style="margin-top: 0.5rem; margin-left: 1rem">
        <li v-if="hasActiveSearch">Verifique a ortografia dos termos de busca</li>
        <li v-if="hasActiveSearch">Tente termos mais gerais</li>
        <li v-if="!hasActiveSearch">Selecione diferentes gêneros</li>
        <li v-if="!hasActiveSearch">Mude a plataforma para "Todas as plataformas"</li>
        <li v-if="!hasActiveSearch">Aumente a quantidade de RAM disponível</li>
        <li>Limpe os filtros para ver todos os jogos disponíveis</li>
      </ul>

      <div style="margin-top: 1rem">
        <button @click="resetFilters" class="btn btn-primary">
          Limpar Filtros e Busca
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const gameStore = useGameStore()
const carouselRef = ref<HTMLElement>()

const hasSearched = ref(false)
const sortBy = ref('title')
const shuffledGames = ref<typeof gameStore.filteredGames>([])

// Refs para os filtros locais
const selectedGenres = ref<string[]>([])
const selectedPlatform = ref('all')
const selectedRAM = ref(4)

// Paginação
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed properties
const availableGenres = computed(() => gameStore.availableGenres)
const loading = computed(() => gameStore.loading)
const error = computed(() => gameStore.error)
const filteredGames = computed(() => gameStore.filteredGames)
const searchQuery = computed(() => gameStore.searchQuery)

// Verificar se há busca ativa
const hasActiveSearch = computed(() => {
  return searchQuery.value.trim().length > 0
})

// Verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return selectedGenres.value.length > 0 ||
         selectedPlatform.value !== 'all' ||
         selectedRAM.value > 4
})

// Jogos ordenados
const sortedGames = computed(() => {
  const games = shuffledGames.value.length > 0 ? shuffledGames.value : filteredGames.value

  return [...games].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'genre':
        return a.genre.localeCompare(b.genre)
      case 'platform':
        return a.platform.localeCompare(b.platform)
      default:
        return 0
    }
  })
})

// Paginação computada
const totalPages = computed(() => Math.ceil(sortedGames.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, sortedGames.value.length),
)

const paginatedGames = computed(() => {
  return sortedGames.value.slice(startIndex.value, endIndex.value)
})

// Páginas visíveis para navegação
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const halfVisible = Math.floor(maxVisible / 2)

  let start = Math.max(1, currentPage.value - halfVisible)
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Jogos populares (primeiros 10 jogos)
const popularGames = computed(() => {
  return gameStore.games.slice(0, 10).map((game) => ({
    ...game,
    size: 'N/A', // Placeholder para tamanho
  }))
})

// Últimos jogos (próximos 20 jogos)
const latestGames = computed(() => {
  return gameStore.games.slice(10, 30).map((game) => ({
    ...game,
    size: 'N/A',
    updatedDate: 'N/A',
    repack: 'N/A',
    badge: Math.random() > 0.7 ? 'PREMIUM' : null,
  }))
})

// Methods
const findGames = async () => {
  hasSearched.value = true
  shuffledGames.value = []
  currentPage.value = 1 // Reset para primeira página

  // Atualizar filtros na store
  gameStore.updateFilters({
    genres: selectedGenres.value,
    platform: selectedPlatform.value,
    ramGB: selectedRAM.value,
  })
}

const selectRandomGame = () => {
  if (filteredGames.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredGames.value.length)
    const randomGame = filteredGames.value[randomIndex]

    // Scroll para o jogo selecionado
    const gameElement = document.querySelector(`[data-game-id="${randomGame.id}"]`)
    if (gameElement) {
      gameElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      gameElement.classList.add('highlight')
      setTimeout(() => gameElement.classList.remove('highlight'), 2000)
    }
  }
}

const shuffleGames = () => {
  shuffledGames.value = [...filteredGames.value].sort(() => Math.random() - 0.5)
  currentPage.value = 1 // Reset para primeira página
}

const resetFilters = () => {
  selectedGenres.value = []
  selectedPlatform.value = 'all'
  selectedRAM.value = 4
  gameStore.resetFilters()
  gameStore.clearSelection()
  hasSearched.value = false
  shuffledGames.value = []
  sortBy.value = 'title'
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll para o topo da seção
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollCarousel = (direction: 'prev' | 'next') => {
  if (carouselRef.value) {
    const scrollAmount = 300
    const currentScroll = carouselRef.value.scrollLeft

    if (direction === 'prev') {
      carouselRef.value.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth',
      })
    } else {
      carouselRef.value.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth',
      })
    }
  }
}

// Watch para resetar página quando mudar ordenação
watch(sortBy, () => {
  currentPage.value = 1
})

// Carregar jogos ao montar o componente
onMounted(async () => {
  if (gameStore.games.length === 0) {
    await gameStore.fetchGames()
  }
})
</script>

<style scoped>
.filters-card {
  background: var(--card-background);
  border-radius: 12px;
  padding: 2rem;
  border: var(--border-solid);
  margin-bottom: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.filters-row {
  display: flex;
  gap: 1.5rem;
}

.filters-grid {
  display: grid;
  align-items: center;
}

.form-group {
  flex: 1;
  margin-bottom: 0px !important;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.genres-container {
  margin-top: 1rem;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
  border: var(--border-solid);
}

.genre-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--card-background);
  border: 1px solid transparent;
}

.genre-item:hover {
  background: var(--background-light);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.genre-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--primary-color);
  cursor: pointer;
}

.genre-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}

/* Estilo para checkboxes selecionadas */
.genre-item:has(.genre-checkbox:checked) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.genre-item:has(.genre-checkbox:checked) .genre-label {
  color: white;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--background-light);
  border: var(--border-solid);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    background-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.game-title.large {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
  text-align: center;
}

.game-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.game-tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.game-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.highlight {
  animation: pulse 2s ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.alert {
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  border: var(--border-solid);
}

.alert-info {
  background: rgb(59 130 246 / 0.1);
  color: var(--primary-color);
  border-color: rgb(59 130 246 / 0.3);
}

.alert-info h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.alert-info p {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
}

.alert-info ul {
  margin: 0;
  color: var(--text-secondary);
}

.alert-info li {
  margin-bottom: 0.5rem;
}

.alert-info .btn {
  margin-top: 1rem;
}

/* Paginação */
.pagination {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: var(--background-light);
  color: var(--text-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.page-btn:hover {
  background: var(--card-background);
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .btns-container {
    display: grid !important;
  }

  .select-width {
    max-width: 100% !important;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-direction: column;
    gap: 1rem;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    max-height: 250px;
    padding: 0.75rem;
  }

  .genre-item {
    padding: 0.375rem;
  }

  .genre-label {
    font-size: 0.8rem;
  }

  .pagination-controls {
    flex-direction: column-reverses;
    gap: 0.5rem;
  }

  .page-numbers {
    order: 2;
  }
}
</style>
