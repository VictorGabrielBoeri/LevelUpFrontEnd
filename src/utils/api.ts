import axios from 'axios'

// Configuração base do axios
const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev ? '/api' : 'https://www.freetogame.com/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Função para tentar diferentes URLs da API
const tryApiCall = async (endpoint: string) => {
  const urls = [
    // Proxy local (desenvolvimento)
    isDev ? `/api${endpoint}` : null,
    // API direta (produção)
    `https://www.freetogame.com/api${endpoint}`,
    // Proxy CORS público como fallback
    `https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api${endpoint}`,
    // Outro proxy CORS
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.freetogame.com/api${endpoint}`)}`
  ].filter(Boolean)

  for (const url of urls) {
    try {
      const response = await axios.get(url!, { timeout: 10000 })
      return response
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error)
      continue
    }
  }

  throw new Error('Todas as tentativas de conexão falharam')
}

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response) {
      // Erro do servidor
      switch (error.response.status) {
        case 404:
          throw new Error('Recurso não encontrado')
        case 500:
          throw new Error('Erro interno do servidor')
        default:
          throw new Error('Erro na comunicação com o servidor')
      }
    } else if (error.request) {
      // Erro de rede
      throw new Error('Erro de conexão. Verifique sua internet.')
    } else {
      // Outros erros
      throw new Error('Erro inesperado')
    }
  }
)

// Função para fazer chamadas com fallback
export const apiCall = async (endpoint: string) => {
  try {
    // Primeiro tenta com a configuração padrão
    const response = await api.get(endpoint)
    return response
  } catch (error) {
    console.warn('Primary API call failed, trying fallback...')
    // Se falhar, tenta com os proxies alternativos
    return await tryApiCall(endpoint)
  }
}

export default api
