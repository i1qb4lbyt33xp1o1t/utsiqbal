// app/api/chat/route.js
import axios from 'axios';

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', // Perbaikan nama model
      {
        inputs: `<|system|>You are a helpful assistant.<|user|>${message}<|assistant|>`,
        parameters: {
          max_new_tokens: 150,
          return_full_text: false,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data[0].generated_text.trim();

    return new Response(JSON.stringify({
      response: reply,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error with Hugging Face API:', error);
    return new Response(JSON.stringify({
      response: 'Sorry, something went wrong with Hugging Face. Try again!',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
