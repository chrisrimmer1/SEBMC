import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Netlify sets this automatically when Neon is connected
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('Database URL environment variable is not set');
    }

    const sql = neon(databaseUrl);

    // For now, using a default user. In the future, you can add user authentication
    const userId = 'default';
    const canvasName = 'My Canvas';

    const result = await sql`
      SELECT data, last_modified
      FROM canvas_data
      WHERE user_id = ${userId} AND canvas_name = ${canvasName}
      LIMIT 1
    `;

    if (result.length === 0) {
      // Return empty canvas structure if no data exists
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Canvas not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        canvasData: result[0].data,
        lastModified: result[0].last_modified,
      }),
    };
  } catch (error) {
    console.error('Error fetching canvas:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch canvas data' }),
    };
  }
};
