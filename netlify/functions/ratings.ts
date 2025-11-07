import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Get ratings for a graph
        const { graphId } = event.queryStringParameters || {}
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Get ratings',
            graphId,
            ratings: []
          }),
        }

      case 'POST':
        // Submit a rating
        const ratingData = JSON.parse(event.body || '{}')
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            message: 'Rating submitted',
            rating: ratingData
          }),
        }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

export { handler }
