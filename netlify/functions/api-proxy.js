const axios = require('axios')

exports.handler = async (event, context) => {
  console.log('🚀 API Proxy function called:', {
    method: event.httpMethod,
    path: event.path,
    query: event.queryStringParameters,
    headers: event.headers
  })

  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('📋 Handling OPTIONS request')
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    // Pegar o endpoint da query string
    const { endpoint } = event.queryStringParameters || {}

    if (!endpoint) {
      console.error('❌ No endpoint provided')
      return {
        statusCode: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Endpoint parameter is required',
          message: 'Please provide an endpoint parameter'
        })
      }
    }

    // URL da API Free-To-Play Games
    const apiUrl = `https://www.freetogame.com/api${endpoint}`

    console.log(`🌐 Making request to: ${apiUrl}`)

    // Fazer a requisição para a API
    const response = await axios.get(apiUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'GameFinder/1.0 (Netlify Function)',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
      }
    })

    console.log(`✅ API response received:`, {
      status: response.status,
      dataLength: response.data ? (Array.isArray(response.data) ? response.data.length : 'object') : 'null'
    })

    // Retornar os dados da API
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
      },
      body: JSON.stringify(response.data)
    }

  } catch (error) {
    console.error('❌ API Proxy Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText
    })

    // Retornar erro apropriado
    let statusCode = 500
    let errorMessage = 'Internal server error'

    if (error.response) {
      statusCode = error.response.status
      errorMessage = `API Error: ${error.response.status} - ${error.response.statusText}`
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 408
      errorMessage = 'Request timeout - API took too long to respond'
    } else if (error.code === 'ENOTFOUND') {
      statusCode = 404
      errorMessage = 'API endpoint not found'
    } else if (error.code === 'ECONNREFUSED') {
      statusCode = 503
      errorMessage = 'API service unavailable'
    }

    return {
      statusCode,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: errorMessage,
        message: 'Failed to fetch data from Free-To-Play Games API',
        details: error.message
      })
    }
  }
}
