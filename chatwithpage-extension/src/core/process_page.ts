import { processText } from "~utils/tools"
import { sendToBackground } from "@plasmohq/messaging"

export async function processPage(url) {
    let raw_text = document.body.innerText
    let text_chunks = processText(raw_text)
    chrome.storage.local.get(url, (result) => {
      switch (result[url]) {
        case "PROCESSED":
          break;
        case "PROCESSING":
          break;
        default:
          console.log("Sent to process")
          chrome.storage.local.set({[url]: "PROCESSING" }, () => {
              sendToBackground({
                name: "ping",
                body: {
                  text: text_chunks,
                  url: window.location.href
                }
              })
            })
          break;
      }})
    }