'use client';
import type { FC } from "react"
import { useState, useEffect } from "react"

import cssText from "data-text:~style.css"
import { createRoot } from "react-dom/client"
import type {
    PlasmoCSUIJSXContainer,
    PlasmoCSUIProps,
    PlasmoRender
  } from "plasmo"
import type { PlasmoCSConfig } from "plasmo"

import { SearchOnPageForm } from "src/components/content-script/search-form"
import { processPage } from "src/core/process_page"
import { clearHighlights } from "~utils/tools";


const Page: FC<
    PlasmoCSUIProps & { show: boolean }
    > = ({ show }) => {
        let parent_iframe = document.querySelector("iframe")
        if (show){
            parent_iframe.style.display = "block";
            return (
                <SearchOnPageForm />
            )
        } else {
            document.querySelector("iframe")
            parent_iframe.style.display = "none";
            console.log("hiding iframe")
            return (
                <div></div>
            )
        }
}

const SHADOW_HOST_ID = "hoverscan-content"

export const getRootContainer = () => {
  let iframe = document.querySelector("iframe.fuzzy-search") as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement("iframe") as HTMLIFrameElement;
    iframe.className = "fuzzy-search";
    iframe.style.position = "fixed";  
    iframe.style.left = "50%";  // Center horizontally
    iframe.style.bottom = "50px";  // 50px padding from the bottom
    iframe.style.transform = "translateX(-50%)";  // Adjust for true centering
    iframe.style.zIndex = "2147483647";  // Max zIndex
    iframe.style.backgroundColor = "transparent";
    iframe.style.border = 'none'
    iframe.style.height = "300px";
    iframe.style.width = "500px";
    iframe.style.display = "none";
    
    document.body.insertAdjacentElement("beforebegin", iframe);
  }
  const iframeDocument = iframe.contentWindow.document;
  let themeColorMeta = iframeDocument.querySelector('meta[name="theme-color"]');
  let themeColor = themeColorMeta ? themeColorMeta.getAttribute('content') : "transparent";
  iframeDocument.body.style.backgroundColor = themeColor;

  let shadowHost = iframeDocument.querySelector(SHADOW_HOST_ID);
  if (!shadowHost) {
    shadowHost = iframeDocument.createElement(SHADOW_HOST_ID);
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });
    iframeDocument.body.appendChild(shadowHost);
    return shadowRoot;
  }
  return shadowHost.shadowRoot;
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
    createRootContainer
  }) => {
    const rootContainer = await createRootContainer()
    const style = document.createElement("style")
    style.textContent = cssText
    rootContainer.appendChild(style)
    const root = createRoot(rootContainer)
    const Wrapper = () => {
        const [showAI, setShowAI] = useState(false)
        useEffect(() => {
          clearHighlights()
            if (showAI) { 
                console.log("Sent info to process page")
                processPage(window.location.href)
            }
        }, [showAI])
        
        const messageListener = (message) => {
            if (message.name === "showSearch") {
                // flip stage
                console.log("flipping")
                setShowAI(!showAI)
            }
        }
        chrome.runtime.onMessage.addListener(messageListener)
        
        return (
          <div>
            <Page show={showAI} />
          </div>
        )

      }
      root.render(<Wrapper />)
    }
    

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
}
      
