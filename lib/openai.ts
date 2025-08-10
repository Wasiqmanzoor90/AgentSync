import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
   'HTTP-Referer': 'https://agent-sync-git-master-wasiqmanzoor90s-projects.vercel.app',
    'X-Title': 'My Chat App',
  },
});

export class Chat {
  private messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

  async sendMessage(message: string): Promise<string> {
    // Add user message to conversation
    this.messages.push({ role: 'user', content: message });

    // Keep only last 20 messages to avoid token limits
    if (this.messages.length > 20) {
      this.messages = this.messages.slice(-20);
    }

    // Send all messages for context
    const res = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct',
      messages: this.messages,
    });

    const response = res.choices[0].message.content || '';
    
    // Add AI response to conversation
    this.messages.push({ role: 'assistant', content: response });

    return response;
  }

  clearChat() {
    this.messages = [];
  }
}

// Usage:
// const chat = new Chat();
// const response1 = await chat.sendMessage("Hello, what's your name?");
// const response2 = await chat.sendMessage("What did I just ask you?"); // Remembers previous context