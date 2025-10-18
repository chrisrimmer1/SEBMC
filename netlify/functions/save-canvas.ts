import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
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

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { canvasData } = JSON.parse(event.body);

    if (!canvasData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'canvasData is required' }),
      };
    }

    const sql = neon(databaseUrl);

    // For now, using a default user. In the future, you can add user authentication
    const userId = 'default';
    const canvasName = 'My Canvas';

    // Upsert the canvas data
    const result = await sql`
      INSERT INTO canvas_data (user_id, canvas_name, data, last_modified)
      VALUES (${userId}, ${canvasName}, ${JSON.stringify(canvasData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, canvas_name)
      DO UPDATE SET
        data = ${JSON.stringify(canvasData)},
        last_modified = CURRENT_TIMESTAMP
      RETURNING last_modified
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        lastModified: result[0].last_modified,
      }),
    };
  } catch (error) {
    console.error('Error saving canvas:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to save canvas data' }),
    };
  }
};
