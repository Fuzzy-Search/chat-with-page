import OFFSCREEN_DOCUMENT_PATH from "url:~src/offscreen/offscreen.html"

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://tally.so/r/nGp5lp');
    chrome.tabs.create({url: "https://meta-payments.vercel.app/onboarding"});
  }
});



chrome.commands.onCommand.addListener(function(command) {
  console.log("Command:", command)
  if (command === "dosearch") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
          "name": "showSearch",
          "showSearch": "true"
        }
        );
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message received:", request)
  if (request.name === "showSearch") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
          "name": "showSearch",
          "showSearch": "true"
        }
        );
    });
  }
});

async function createOffscreenDocument() {
  if (!(await hasDocument())) {
    await chrome.offscreen
      .createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [chrome.offscreen.Reason.WEB_RTC],
        justification: "P2P data transfer"
      })
      console.log("message to initialize offscreen document sent")
      chrome.runtime.sendMessage({
        type: "INITIALIZE",
        target: "offscreen",
        data: []
      }, () => {});
      await new Promise(resolve => setTimeout(resolve, 15000));

  }
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

createOffscreenDocument();

export { createOffscreenDocument }