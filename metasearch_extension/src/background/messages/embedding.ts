import type { PlasmoMessaging } from "@plasmohq/messaging"
import { EmbeddingIndex } from '~cvs/index';
import { IndexedDbManager } from '~cvs/indexedDB';



const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const vectors_blob = req.body.vectors; 
    const response = await fetch(vectors_blob);
    const responseJson = await response.json();
    const vectors = responseJson.map(vector => 
        JSON.parse(vector)
    );
    const textBodies = req.body.textBodies;
    const url = req.body.url;
    const initialObjects = [];
    for(let i = 0; i < vectors .length; i++) {
        initialObjects.push({ id: i, name: textBodies[i], embedding: vectors[i] });
    }
    const index = new EmbeddingIndex(initialObjects);
    res.send({ message: "embedding.ts: index created"})

    const DBname = "ChromeSearch";
    const objectStoreName = url;

    let existsInDB = await IndexedDbManager.doesObjectStoreExist(DBname, objectStoreName);
    if (existsInDB) {
      console.log(`Object store '${objectStoreName}' exists in the database. Do Not rewrite`); 
      return;
    }

    await index.saveIndex("indexedDB", { DBName: "ChromeSearch", objectStoreName: url})
    console.log("embedding.ts: index saved")
    chrome.storage.local.set({ [url]: "PROCESSED" }, () => {
    });
  }
   
  export default handler