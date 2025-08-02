<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useGameStore } from '@/stores/gameStore'

const { theme, toggleTheme } = useTheme()
const gameStore = useGameStore()

const searchQuery = ref('')
const selectedCategory = ref('all')
const sidebarOpen = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

const categories = [
  { id: 'all', name: 'Todas as Categorias', icon: '📋' },
  { id: 'action', name: 'Ação', icon: '⚔️' },
  { id: 'rpg', name: 'RPG', icon: '📜' },
  { id: 'strategy', name: 'Estratégia', icon: '🎯' },
  { id: 'adventure', name: 'Aventura', icon: '🗺️' },
  { id: 'sports', name: 'Esportes', icon: '⚽' },
  { id: 'racing', name: 'Corrida', icon: '🏎️' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
  { id: 'indie', name: 'Indie', icon: '💡' },
  { id: 'casual', name: 'Casual', icon: '💎' },
  { id: 'multiplayer', name: 'Multijogador', icon: '🌐' },
  { id: 'single-player', name: 'Um Jogador', icon: '👤' },
  { id: 'platform', name: 'Plataforma', icon: '🟦' },
  { id: 'shooter', name: 'Tiro', icon: '🎯' },
  { id: 'simulation', name: 'Simulação', icon: '✈️' },
]

const handleSearch = () => {
  // Debounce para melhorar performance
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    gameStore.updateSearchQuery(searchQuery.value)
  }, 300) // 300ms de delay
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId

  // Filtrar jogos por categoria
  if (categoryId === 'all') {
    // Manter filtros atuais, apenas limpar gêneros específicos
    gameStore.updateFilters({
      genres: [],
      platform: gameStore.filters.platform,
      ramGB: gameStore.filters.ramGB
    })
  } else {
    // Filtrar por categoria específica
    const categoryMap: { [key: string]: string[] } = {
      'action': ['Action', 'Action Game', 'Action RPG', 'Fighting', 'Shooter'],
      'rpg': ['RPG', 'MMORPG', 'ARPG', 'MMOARPG'],
      'strategy': ['Strategy', 'Card Game', 'MOBA'],
      'adventure': ['Adventure', 'Fantasy'],
      'sports': ['Sports', 'Racing'],
      'racing': ['Racing'],
      'puzzle': ['Puzzle', 'Social'],
      'indie': ['Indie'],
      'casual': ['Casual'],
      'multiplayer': ['MMORPG', 'MMO', 'MMOARPG', 'MOBA', 'Social'],
      'single-player': ['RPG', 'Action', 'Adventure', 'Strategy'],
      'platform': ['Platform'],
      'shooter': ['Shooter', 'FPS'],
      'simulation': ['Simulation']
    }

    const genres = categoryMap[categoryId]
    if (genres) {
      gameStore.updateFilters({
        genres: genres,
        platform: gameStore.filters.platform,
        ramGB: gameStore.filters.ramGB
      })
    }
  }

  // Fechar sidebar em mobile após selecionar categoria
  if (window.innerWidth <= 1024) {
    closeSidebar()
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div id="app">
    <!-- Header (visível apenas em desktop) -->
    <header class="header desktop-only">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">🎮</div>
          <div class="logo-text">
            <span class="logo-main">GAME</span>
            <span class="logo-sub">FINDER</span>
          </div>
        </div>
      </div>

      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Pesquisar jogos..."
          v-model="searchQuery"
          @input="handleSearch"
        />
      </div>

      <div class="header-actions">
        <!-- Botão de Tema -->
        <button
          class="theme-btn"
          @click="toggleTheme"
          :title="theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
        >
          {{ theme === 'dark' ? '☀️' : '🌙' }}
        </button>

        <div class="user-greeting">
          <span>👤</span>
          Bem-vindo, Visitante!
        </div>
      </div>
    </header>

    <!-- Header Mobile (apenas hambúrguer) -->
    <header class="header-mobile mobile-only">
      <button class="hamburger-menu" @click="toggleSidebar" :class="{ active: sidebarOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="logo">
        <div class="logo-icon">🎮</div>
        <div class="logo-text">
          <span class="logo-main">GAME</span>
          <span class="logo-sub">FINDER</span>
        </div>
      </div>
    </header>

    <!-- Overlay para fechar o menu (visível apenas em mobile) -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <!-- Header Mobile dentro do Sidebar -->
      <div class="sidebar-header-mobile mobile-only">
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Pesquisar jogos..."
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>

        <div class="header-actions-mobile">
          <button class="btn btn-secondary">
            <span>❤️</span>
            Favoritos
          </button>

          <!-- Botão de Tema (apenas mobile) -->
          <button
            class="theme-toggle"
            @click="toggleTheme"
            :title="theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
          >
            {{ theme === 'dark' ? '☀️' : '🌙' }}
          </button>

          <div class="user-greeting">
            <span>👤</span>
            Bem-vindo, Visitante!
          </div>
        </div>
      </div>

      <!-- Header Desktop dentro do Sidebar -->
      <div class="sidebar-header desktop-only">
        <h2 class="sidebar-title">Início</h2>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="category in categories"
          :key="category.id"
          class="nav-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="nav-icon">{{ category.icon }}</span>
          {{ category.name }}
        </button>
      </nav>

      <!-- Botão de fechar (visível apenas em mobile) -->
      <button class="close-sidebar mobile-only" @click="closeSidebar">✕</button>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
