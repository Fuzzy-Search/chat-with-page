// Import necessary modules
const express = require('express');
const OpenAI = require('openai');
const { OpenAIStream, streamToResponse } = require('ai');


// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // you dont need it! just a placeholder
  baseURL: 'http://0.0.0.0:8000/v1/' // url where you local model is running!
});

const app = express();
app.use(express.json({ type: '*/*' }));

async function createChatCompletion(input, context) {
  return await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
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


app.post('/', async (req, res) => {
  try {
    const { messages, context } = await req.body
    const input = messages.reverse().find(msg => msg.role === 'user')?.content;
    if (!input) {
      return res.status(400).send('No input provided');
    }
    
    const response = await createChatCompletion(input, context);

    const stream = OpenAIStream(response);
    streamToResponse(stream, res);

  } catch (error) {
    console.error(`Internal Server Error: ${error.message}`);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

// Server Listening
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});

