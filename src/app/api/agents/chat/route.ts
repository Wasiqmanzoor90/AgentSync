import { sendMessage } from "../../../../../lib/openai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const response = await sendMessage(message);
    return Response.json({ response });
  } catch (error: any) {

    return Response.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}