import type { PlasmoMessaging } from "@plasmohq/messaging"
import OFFSCREEN_DOCUMENT_PATH from "url:~src/offscreen/offscreen.html"
import { EmbeddingIndex } from '~cvs/index';


    
async function createOffscreenDocument(data, url) {
    if (!(await hasDocument())) {
    try {
        await chrome.offscreen
            .createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: [chrome.offscreen.Reason.WEB_RTC],
            justification: "P2P data transfer"
            })
              await new Promise(resolve => setTimeout(resolve, 15000));
    } catch (e) {
    }
    } else {
    }
    return new Promise((resolve) => {
    chrome.runtime.sendMessage({
        type: "single-embedding",
        target: "offscreen",
        data: {
        text: data,
        }
    }, (resp) => {
        resolve(resp)
    });
    });
}
    
async function hasDocument() {
    // @ts-ignore clients
    const matchedClients = await clients.matchAll()
    for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
        return true
    }
    }
    return false
}

    
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const text = req.body.text;
    const url = req.body.url;
    console.log("search.ts: message: ", text, url)
    try {
        const queryEmbedding = await createOffscreenDocument(text, url);
        // search through the database
        const index = new EmbeddingIndex();
        const searchResult = await index.search(queryEmbedding as number[], {
            topK: 10,
            useStorage: "indexedDB",
            storageOptions: { // only if you want to override the default options, defaults are below
              indexedDBName: 'ChromeSearch',
              indexedDBObjectStoreName: url
            }
        });
        console.log("search.ts results ready: ")
        console.log(searchResult);
        res.send({
            searchResult
        })
    } catch (e) {
        console.log("search.ts error: ", e);
        throw e;
    }
}

export default handler