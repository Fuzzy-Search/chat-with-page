import { modelManagerInstance } from '~cvs/index';
import { sendToBackground } from "@plasmohq/messaging"



chrome.runtime.onMessage.addListener(processMessages);

const GENERATE_EMBEDDING = 'generate-embedding';

async function processMessages(message, sender, sendResponse) {
    console.log('offscreen.js: processing message', message);
  if (message.target !== 'offscreen') {
    return false;
  }


  switch (message.type) {
    case "INITIALIZE":
      await modelManagerInstance.initializeModel(chrome.runtime.getURL("src/ML/models/bge-small-en-v1.5"));
      console.log('offscreen.js: initialized model');
      await sendResponse(true);
      break;
    case GENERATE_EMBEDDING:
        let attempts1 = 0;
        while (attempts1 < 3) {
          try {
            await generateEmbeddings(message.data, sendResponse);
            break;
          } catch (error) {
            attempts1++;
            console.error(`Attempt ${attempts1} failed with error: ${error}`);
          }
        }
      break;

    case "single-embedding":
      let vector;
      let attempts2 = 0;
      while (attempts2 < 3) {
        try {
          vector = await modelManagerInstance.getEmbedding(message.data.text);
          console.log('offscreen.js: processed message', message.data.text);
          await sendResponse(vector);
          break;
        } catch (error) {
          attempts2++;
          console.error(`Attempt ${attempts2} failed with error: ${error}`);
        }
      }
      break

    default:
      console.warn(`Received unexpected message type: '${message.type}'.`);
      return false;
  }
async function generateEmbeddings(data) {
  const { text, url } = data;
  try {
    const textBodies = Array.isArray(text) ? text : [text];
    const vectors = [];
    for (const body of textBodies) {
        const vector = await modelManagerInstance.getEmbedding(body);
        vectors.push(JSON.stringify(vector));
    }
    const blob = new Blob([JSON.stringify(vectors)], {type: "application/json"});
    const bloburl = URL.createObjectURL(blob);
    await sendToBackground({
        name: "embedding",
        body: {
            vectors: bloburl,
            textBodies: textBodies,
            url: url
        }
    })
     
  } catch (error) {
    console.error(`Failed to fetch embedding: ${error}`);
  }
}
}
