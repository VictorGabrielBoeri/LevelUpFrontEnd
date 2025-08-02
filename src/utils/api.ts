import axios from 'axios'

// Configuração base do axios
const api = axios.create({
  baseURL: 'https://www.freetogame.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Função para detectar se estamos no Netlify
const isNetlify = () => {
  return typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')
}

// Função para fazer chamadas com fallback
export const apiCall = async (endpoint: string) => {
  try {
    // Se estiver no Netlify, usar a função serverless
    if (isNetlify()) {
      const response = await axios.get(`/.netlify/functions/api-proxy?endpoint=${endpoint}`)
      return response
    }

    // Se estiver em desenvolvimento, usar proxy local
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const response = await axios.get(`/api${endpoint}`)
      return response
    }

    // Em produção (não Netlify), tentar API direta
    const response = await api.get(endpoint)
    return response

  } catch (error) {
    console.warn('Primary API call failed, trying fallback...')

    // Fallback: tentar diferentes URLs
    const urls = [
      // API direta
      `https://www.freetogame.com/api${endpoint}`,
      // Proxy CORS público
      `https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api${endpoint}`,
      // Outro proxy CORS
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.freetogame.com/api${endpoint}`)}`
    ]

    for (const url of urls) {
      try {
        const response = await axios.get(url, { timeout: 10000 })
        return response
      } catch (fallbackError) {
        console.warn(`Failed to fetch from ${url}:`, fallbackError)
        continue
      }
    }

    throw new Error('Todas as tentativas de conexão falharam')
  }
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

export default api
