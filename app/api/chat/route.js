import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ambil dari .env.local
});

export async function POST(req) {
  try {
    const { message } = await req.json(); // Ambil pesan dari klien
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Model yang Anda minta sebelumnya
      messages: [{ role: 'user', content: message }],
    });
    return new Response(JSON.stringify({
      response: completion.choices[0].message.content,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return new Response(JSON.stringify({
      response: 'Sorry, something went wrong. Try again!',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}