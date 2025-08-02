import { defineStore } from 'pinia'
import api, { apiCall } from '@/utils/api'

export interface Game {
  id: number
  title: string
  thumbnail: string
  short_description: string
  game_url: string
  genre: string
  platform: string
  publisher: string
  developer: string
  release_date: string
  freetogame_profile_url: string
  minimum_system_requirements?: {
    os?: string
    processor?: string
    memory?: string
    graphics?: string
    storage?: string
  }
}

export interface GameFilters {
  genres: string[]
  platform: string
  ramGB: number
}

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [] as Game[],
    filteredGames: [] as Game[],
    selectedGame: null as Game | null,
    loading: false,
    error: null as string | null,
    searchQuery: '' as string,
    filters: {
      genres: [] as string[],
      platform: 'all',
      ramGB: 4
    } as GameFilters
  }),

  getters: {
    availableGenres: (state) => {
      const genres = new Set<string>()
      state.games.forEach(game => {
        if (game.genre) {
          genres.add(game.genre)
        }
      })
      return Array.from(genres).sort()
    },

    availablePlatforms: (state) => {
      const platforms = new Set<string>()
      state.games.forEach(game => {
        if (game.platform) {
          platforms.add(game.platform)
        }
      })
      return Array.from(platforms).sort()
    }
  },

  actions: {
            async fetchGames() {
      this.loading = true
      this.error = null

      try {
        const response = await apiCall('/games')
        this.games = response.data
        this.applyFilters()
      } catch (error) {
        console.error('Error fetching games:', error)
        this.error = error instanceof Error ? error.message : 'Erro ao carregar jogos. Tente novamente mais tarde.'
      } finally {
        this.loading = false
      }
    },

    async fetchGameDetails(gameId: number) {
      try {
        const response = await apiCall(`/game?id=${gameId}`)
        return response.data
      } catch (error) {
        console.error('Error fetching game details:', error)
        return null
      }
    },

    updateFilters(filters: Partial<GameFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.applyFilters()
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query
      this.applyFilters()
    },

    applyFilters() {
      let filtered = [...this.games]

      // Filtrar por busca de texto
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(game =>
          game.title.toLowerCase().includes(query) ||
          game.genre.toLowerCase().includes(query) ||
          game.publisher.toLowerCase().includes(query) ||
          game.developer.toLowerCase().includes(query) ||
          game.short_description.toLowerCase().includes(query)
        )
      }

      // Filtrar por gênero
      if (this.filters.genres.length > 0) {
        filtered = filtered.filter(game =>
          this.filters.genres.includes(game.genre)
        )
      }

      // Filtrar por plataforma
      if (this.filters.platform !== 'all') {
        filtered = filtered.filter(game =>
          game.platform.toLowerCase().includes(this.filters.platform.toLowerCase())
        )
      }

      // Filtrar por RAM (se disponível)
      if (this.filters.ramGB > 0) {
        filtered = filtered.filter(game => {
          // Para jogos que têm requisitos mínimos, verificar RAM
          if (game.minimum_system_requirements?.memory) {
            const requiredRAM = this.extractRAMFromString(game.minimum_system_requirements.memory)
            return requiredRAM <= this.filters.ramGB
          }
          // Se não há requisitos específicos, incluir o jogo
          return true
        })
      }

      this.filteredGames = filtered
    },

    extractRAMFromString(ramString: string): number {
      // Extrair valor de RAM de strings como "4 GB RAM", "8GB", etc.
      const match = ramString.match(/(\d+)\s*GB/i)
      return match ? parseInt(match[1]) : 0
    },

    selectRandomGame(): Game | null {
      if (this.filteredGames.length === 0) {
        return null
      }

      const randomIndex = Math.floor(Math.random() * this.filteredGames.length)
      this.selectedGame = this.filteredGames[randomIndex]
      return this.selectedGame
    },

    clearSelection() {
      this.selectedGame = null
    },

    resetFilters() {
      this.filters = {
        genres: [],
        platform: 'all',
        ramGB: 4
      }
      this.searchQuery = ''
      this.applyFilters()
    }
  }
})
