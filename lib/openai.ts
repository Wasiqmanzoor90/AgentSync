import OpenAI from 'openai'  //  Correct: "OpenAI" (capital I)

const openai = new OpenAI({  //  Use the correct import name
  apiKey: process.env.OPENAI_API_KEY,
});

export async function sendMessage(message: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });
  return res.choices[0].message.content;
}