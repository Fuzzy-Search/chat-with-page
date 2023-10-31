import type { PlasmoMessaging } from "@plasmohq/messaging"
import OFFSCREEN_DOCUMENT_PATH from "url:~src/offscreen/offscreen.html"

async function createOffscreenDocument(data) {
  let documentUrl = OFFSCREEN_DOCUMENT_PATH;
  if (!(await hasDocument())) {
    try {
      await chrome.offscreen
        .createDocument({
          url: OFFSCREEN_DOCUMENT_PATH,
          reasons: [chrome.offscreen.Reason.WEB_RTC],
          justification: "P2P data transfer"
        })
        console.log("message to initialize offscreen document sent")
        await new Promise(resolve => setTimeout(resolve, 15000));
    } catch (e) {
    }
  } else {
    documentUrl = await getDocumentUrl();
  }
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: "generate-embedding",
      target: "offscreen",
      data: data
    }, () => {});
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

async function getDocumentUrl() {
  // @ts-ignore clients
  const matchedClients = await clients.matchAll()
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      return client.url
    }
  }
  return OFFSCREEN_DOCUMENT_PATH
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("ping.ts: message: ", req)
  const url = req.body.url;
  let existsInDB = false;
  
  const request = indexedDB.open('ChromeSearch');
  let db: IDBDatabase;
  
  request.onerror = (event) => {
    console.error('IndexedDB error:', event);
  };
  
  request.onsuccess = async () => {
    db = request.result;
    // console.log("URL: ", url)
    if (!db.objectStoreNames.contains(url)) {
    } else {
      existsInDB = true;
    }
  db.close();

  if (existsInDB) {
    res.send({
      resp: {
        data: "exists"
      }
    })
    return;
  }

  // check the status
  let skip = false;
  chrome.storage.local.get(url, (result) => {
    console.log("ping.ts: chrome storage: ", result)
    if (result[url] === "PROCESSING" || result[url] === "PROCESSED") {
      console.log("ping.ts: processing/processed -> skipping")
      skip = true;
    }});
  if (skip) {
    return;
  }


  chrome.storage.local.set({ [url]: "PROCESSING" }, () => {
  });
  
  if (!existsInDB) {
    try {
      const resp = await createOffscreenDocument(req.body);
      console.log("ping.ts response: ", resp);
      res.send({
        resp
      })
    } catch (e) {
      console.error(`Failed to create offscreen: ${e}`);
    }
  }
}
}

export default handler