// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'https://www.freetogame.com/api',
  TIMEOUT: 10000
}

// Configurações da aplicação
export const APP_CONFIG = {
  TITLE: 'Game Finder',
  DESCRIPTION: 'Encontre o jogo perfeito para você',
  VERSION: '1.0.0'
}

// Chaves do localStorage
export const STORAGE_KEYS = {
  GENRES: 'game-finder-genres',
  PLATFORM: 'game-finder-platform',
  RAM: 'game-finder-ram'
}

// Valores padrão
export const DEFAULT_VALUES = {
  GENRES: [] as string[],
  PLATFORM: 'all',
  RAM: 4
}

// Opções de plataforma
export const PLATFORM_OPTIONS = [
  { value: 'all', label: 'Todas as plataformas' },
  { value: 'pc', label: 'PC' },
  { value: 'browser', label: 'Navegador' }
]

// Limites de RAM
export const RAM_LIMITS = {
  MIN: 1,
  MAX: 64,
  STEP: 1
}
