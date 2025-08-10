import { Chat } from "../../../../../lib/openai";

// Store chat sessions in memory (for simple apps)
// For production, use Redis, database, or other persistent storage
const chatSessions = new Map<string, Chat>();

export async function POST(request: Request) {
  try {
    const { message, sessionId = 'default' } = await request.json();
    
    // Get or create chat session
    if (!chatSessions.has(sessionId)) {
      chatSessions.set(sessionId, new Chat());
    }
    
    const chat = chatSessions.get(sessionId)!;
    const response = await chat.sendMessage(message);
    
    return Response.json({ response });
  } catch (error: any) {
    return Response.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}

