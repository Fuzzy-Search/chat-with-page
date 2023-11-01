"use client"

import { useEffect, useRef, useState } from "react"
import SubmitButton  from "./submitButton"
import { useChat } from 'ai/react';
import { performSemanticSearch } from "src/core/perform_semantic_search"
import Markdown from 'markdown-to-jsx'
import { Button } from "src/components/ui/button"
import { highlightText, clearHighlights } from "~utils/tools";




interface SearchFormProps {
  initialPrompt?: string
}

function searchResultsToText(searchResults: any[], limit: number = 5) {
  return "Context:\n" + searchResults.slice(0, limit).map((result, index) => `doc ${index + 1}. "${result.object.name}"`).join("\n")
}

function parseOutput(output: string): any[] {
  let regex = /(.+?)\nsource: (.+?)(?:\n|$)/gi;

  let parsedOutput = [];
  let match;
  
  while ((match = regex.exec(output)) !== null) {
    let sentence = match[1].replace(/^answer:\s*/i, '').trim();
    let references = match[2].split(', ').map(doc => {
      let num = doc.replace(/[^0-9]/g, ''); // Remove non-digit characters
      return parseInt(num, 10); // Convert to integer
    });
    parsedOutput.push({ sentence, references });
  }
  return parsedOutput;
}

export const SearchOnPageForm = ({ initialPrompt }: SearchFormProps) => {
    const submitRef = useRef<React.ElementRef<"button">>(null)
    const [contextText, setContextText] = useState<string>("");
    const [resultReady, setResultReady] = useState<boolean>(false);
    const [event, setEvent] = useState<React.FormEvent<HTMLFormElement>>(null);
    const [parsedOutput, setParsedOutput] = useState<any[]>([]);
    const [SearchResults, setSearchResults] = useState<any[]>([]);

    const { input, setInput, handleInputChange, handleSubmit, messages } =
    useChat({
        api: "http://localhost:3000",
        body: {
          context: contextText,
        }
    });
    // forward link -> get from settings

    const onSubmit = async (e: any) => {
        e.preventDefault();
        setResultReady(false);
        const results = await performSemanticSearch(input);
        setSearchResults(results);
        const searchResultsText = searchResultsToText(results);
        setContextText(searchResultsText);
        setInput(input);
        setResultReady(true);
        setEvent(e)
    };

    useEffect(() => {
      if (resultReady) {
        handleSubmit(event);
      }
    }, [resultReady]);

    const lastMessage = messages[messages.length - 1];
    const generatedAnswer = lastMessage?.role === "assistant" ? lastMessage.content : null;

    useEffect(() => {
      if (generatedAnswer) {
        try {
          let parsedOutputString = parseOutput(generatedAnswer)
          if (parsedOutputString.length === 0){
            let sentence = generatedAnswer.replace(/^answer:\s*/i, '').trim();
            parsedOutputString = [{ sentence, references: [] }];
          }
          setParsedOutput(parsedOutputString)
        } catch (error) {
          console.log("Error parsing output", error)
        }
      }
    }, [generatedAnswer]);


    const showReference = (ref: number) => {
      const reference = SearchResults[ref - 1]
      clearHighlights()
      highlightText(reference.object.name, {"className": "AIsearch"})
      // find it in the page and scroll
      const element = document.querySelector(`.AIsearch`)
      if (element) {
        element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      }
    }

  return (
    <div style={{position: 'fixed', bottom: '0', width: '100%'}}>
      <div style={{marginBottom: '10px'}}>
        <div className="space-y-10 my-10 overflow-auto" style={{ maxHeight: '300px' }}>
          {generatedAnswer && (
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              <div
                className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition border mt-20"
                key={generatedAnswer}
                style={{fontFamily: 'Arial, sans-serif'}}
              >
                {parsedOutput && parsedOutput.map((item, index) => (
                  <div key={index}>
                    <Markdown className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl 2xl:prose-2xl" options={{ forceBlock: true }}>
                      {item.sentence}
                    </Markdown>
                    {item.references && item.references.map((ref, refIndex) => (
                      <Button variant="link" key={refIndex} style={{ display: 'inline-block' }} onClick={() => showReference(ref)}>{ref}</Button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={
        onSubmit
      } className="AIsearch bg-black rounded-xl shadow-lg h-fit flex flex-row px-1 items-center w-full">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              submitRef.current?.click()
            }
          }}
          placeholder={initialPrompt}
          className="bg-transparent text-white placeholder:text-gray-400 ring-0 outline-none resize-none py-2.5 px-2 font-mono text-sm h-10 w-full transition-all duration-300"
        />
        <SubmitButton ref={submitRef} />
      </form>
    </div>
  )
}