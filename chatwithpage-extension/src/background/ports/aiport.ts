import type { PlasmoMessaging } from "@plasmohq/messaging"
import { OpenAI } from "openai"

let openAIKey;
let openai;

chrome.storage.local.get('openAIKey', function(data) {
    openAIKey = data.openAIKey;
    openai = new OpenAI({
        apiKey: openAIKey, 
        baseURL: 'https://api.openai.com/v1',
    });
});
    

async function createChatCompletion(input, context) {
    return openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'assistant',
          content: `You need to answer question based on the context.In answer in plain text with end lines to format. Use bullet points.`,
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


const handler: PlasmoMessaging.PortHandler = async (req, res) => {
    const context = req.body.context;
    const query = req.body.query;
    let cumulativeDelta = '';

    const response = await createChatCompletion(query, context);
    response.on('content', (delta, snapshot) => {
        cumulativeDelta += delta;
        res.send({ message: cumulativeDelta})

      });
}
 
export default handler