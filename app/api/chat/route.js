import axios from 'axios';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ 
        response: 'Error: No message provided' 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Format prompt khusus untuk Llama-3 (wajib sesuai template resmi)
    const llama3Prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are a helpful AI assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
      {
        inputs: llama3Prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,  // Untuk kreativitas (0-1)
          top_p: 0.9,       // Untuk kontrol diversity
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000  // Timeout 30 detik (model besar mungkin lambat)
      }
    );

    // Bersihkan output (Llama-3 kadang menambahkan metadata)
    let reply = response.data[0]?.generated_text?.trim() || 'No response generated';
    reply = reply.replace(/<\|.*?\|>/g, '');  // Hapus token khusus

    return new Response(JSON.stringify({ 
      response: reply 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Llama-3 API Error:', error.message);

    // Handle error spesifik
    if (error.code === 'ECONNABORTED') {
      return new Response(JSON.stringify({ 
        response: 'Error: Model is loading, try again in 20 seconds.' 
      }), { 
        status: 503 
      });
    }

    if (error.response?.status === 429) {
      return new Response(JSON.stringify({ 
        response: 'Error: API rate limit exceeded. Upgrade your plan or wait.' 
      }), { 
        status: 429 
      });
    }

    return new Response(JSON.stringify({ 
      response: 'Error: Failed to get AI response. Try a simpler question.',
      details: error.message 
    }), { 
      status: 500 
    });
  }
}
