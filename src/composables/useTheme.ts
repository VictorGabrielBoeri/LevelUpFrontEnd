import { ref, watch, onMounted } from 'vue'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const theme = ref<Theme>('dark')

  // Função para obter tema do localStorage
  const getStoredTheme = (): Theme => {
    try {
      const stored = localStorage.getItem('game-finder-theme')
      return (stored as Theme) || 'dark'
    } catch (error) {
      console.error('Error reading theme from localStorage:', error)
      return 'dark'
    }
  }

  // Função para aplicar tema ao documento
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === 'light') {
      root.classList.add('theme-light')
      root.classList.remove('theme-dark')
    } else {
      root.classList.add('theme-dark')
      root.classList.remove('theme-light')
    }
  }

  // Função para alternar tema
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = newTheme
    localStorage.setItem('game-finder-theme', newTheme)
  }

  // Função para definir tema específico
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('game-finder-theme', newTheme)
  }

  // Observar mudanças no tema
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  // Inicializar tema ao montar
  onMounted(() => {
    const storedTheme = getStoredTheme()
    theme.value = storedTheme
    applyTheme(storedTheme)
  })

  return {
    theme,
    toggleTheme,
    setTheme
  }
}
