import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'http://0.0.0.0:8000/v1/'
});


// Set the runtime to edge for best performance
export const runtime = 'edge';

async function createChatCompletion(input: string, context: string) {
  // Ask OpenAI for a streaming completion given the prompt
  return await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // just for the templates sake
    stream: true,
    messages: [
      {
        role: 'assistant',
        content: `You need to help answer question based on the context. Answer with references of rows numbers you used. In answer use markdown. Always have: anwer and source. example:`,
      },
      {
        role: 'assistant',
        content: `Context:
doc 1. "Many with 20k followers and a Stripe account now run their Twitter as a business. This leads to a decline from authenticity to marketing and sales."
doc 2. "I am possibly unusual. I use Twitter for authenticity. I follow people whose ideas and actions interest me. But authenticity often conflicts with growth."
doc 3. "Authenticity's Slow Death in an Attention Economy"`,
      },
      {
        role: 'user',
        content: `query: What happened to authenticity? `,
      },
      {
        role: 'assistant',
        content: `answer: Authenticity has **declined** and is slowly dying in the attention economy
source: doc 1, doc 3
This **decline** is attributed to many *Twitter* users treating it as a **business** and focusing on **marketing** and **sales**
source: doc 2`,
      },
      {
        role: 'assistant',
        content: `Context: ` + context,
      },
      {
        role: 'user',
        content: "query: " + input,
      }
    ],
  });
}


export async function POST(req: Request) {
  const { messages, context } = await req.json();
  const input = messages.reverse().find((message: { role: string }) => message.role === 'user')?.content;
  if (!input) {
    return new Response('No input provided', { status: 400 });
  }
  console.log(`Input: ${context}`);

  const response = await createChatCompletion(input, context);

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}