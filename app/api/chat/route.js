// app/api/chat/route.js
export const runtime = 'nodejs'; // Needed for process.env to work

import axios from 'axios';

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) {
      throw new Error('No message provided in request');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openchat/openchat-7b', // Or another model of your choice
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim() || 'No response generated';

    return new Response(JSON.stringify({ response: reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error with OpenRouter API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return new Response(JSON.stringify({
      response: 'AI error occurred. Please try again later.',
      error: error.message
    }), {
      status: error.response?.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
