import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Função para obter valor do localStorage
  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  // Criar ref reativo
  const storedValue = ref<T>(getStoredValue())

  // Função para salvar no localStorage
  const setValue = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      storedValue.value = value
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Observar mudanças e salvar automaticamente
  watch(storedValue, (newValue) => {
    setValue(newValue)
  }, { deep: true })

  return {
    value: storedValue,
    setValue
  }
}
