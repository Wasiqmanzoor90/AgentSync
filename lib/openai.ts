import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Your OpenRouter key
  baseURL: 'https://openrouter.ai/api/v1', // Important: override base URL
  defaultHeaders: {
    'HTTP-Referer': 'https://localhost:3000', // Or your site URL
    'X-Title': 'My Chat App', // Optional: adds display title
  },
});

export async function sendMessage(message: string) {
  const res = await openai.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct', // Or any OpenRouter model
    messages: [{ role: 'user', content: message }],
  });

  return res.choices[0].message.content;
}
