const axios = require('axios')

exports.handler = async (event, context) => {
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
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
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Endpoint parameter is required' })
      }
    }

    // URL da API Free-To-Play Games
    const apiUrl = `https://www.freetogame.com/api${endpoint}`

    console.log(`Making request to: ${apiUrl}`)

    // Fazer a requisição para a API
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'GameFinder/1.0',
        'Accept': 'application/json'
      }
    })

    // Retornar os dados da API
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    }

  } catch (error) {
    console.error('API Proxy Error:', error.message)

    // Retornar erro apropriado
    let statusCode = 500
    let errorMessage = 'Internal server error'

    if (error.response) {
      statusCode = error.response.status
      errorMessage = `API Error: ${error.response.status}`
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 408
      errorMessage = 'Request timeout'
    } else if (error.code === 'ENOTFOUND') {
      statusCode = 404
      errorMessage = 'API endpoint not found'
    }

    return {
      statusCode,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: errorMessage,
        message: 'Failed to fetch data from Free-To-Play Games API'
      })
    }
  }
}
