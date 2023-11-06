"use client"

import { useEffect, useRef, useState } from "react"
import SubmitButton  from "./submitButton"
import { performSemanticSearch } from "src/core/perform_semantic_search"
import { Button } from "src/components/ui/button"

import { highlightText, clearHighlights } from "~utils/tools";
import { usePort } from "@plasmohq/messaging/hook"
import { ReloadIcon } from "@radix-ui/react-icons"




interface SearchFormProps {
  initialPrompt?: string
}

function searchResultsToText(searchResults: any[], limit: number = 6) {
  return "Context:\n" + searchResults.slice(0, limit).map((result, index) => `doc ${index + 1}. "${result.object.name}"`).join("\n")
}


export const SearchOnPageForm = ({ initialPrompt }: SearchFormProps) => {
    const submitRef = useRef<React.ElementRef<"button">>(null)
    
    const [input, setInput] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const mailPort = usePort("aiport")

    const onSubmit = async (e: any) => {
      e.preventDefault();
      setIsSubmitting(true);
      setInput(input);
      const results = await performSemanticSearch(input);
      setSearchResults(results.slice(0, 5));
      const searchResultsText = searchResultsToText(results);
      mailPort.send({
          context: searchResultsText,
          query: input
      })
    }

    useEffect(() => {
      if (mailPort.data?.message) {
        setIsSubmitting(false);
      }
    }, [mailPort.data?.message])


    const generatedAnswer = mailPort.data?.message
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    };


    useEffect(() => {
      clearHighlights()
      searchResults.forEach(result => {
        highlightText(result.object.name, {"className": "AIsearch"})
      })
    }, [searchResults])

  return (
    <div style={{position: 'fixed', bottom: '50px', width: '100%', maxHeight: '300px', overflowY: 'scroll'}}>
      <div className="space-y-10 my-10" style={{ maxHeight: 'calc(100% - 50px)' }}>
        {generatedAnswer && (
          <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
            <div
              className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition border"
              key={generatedAnswer}
              style={{fontFamily: 'Arial, sans-serif'}}
            >
              <div className="text-lg">
                <pre style={{whiteSpace: "pre-wrap"}}>{generatedAnswer}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={
        onSubmit
      } className="AIsearch bg-black rounded-xl shadow-lg h-14 flex flex-row px-1" style={{width: '75%', position: 'fixed', bottom: '0', left: '50%', transform: 'translateX(-50%)'}}>
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
        <div className="flex items-center justify-between">
          {isSubmitting ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" style={{color: 'white'}} /> : <SubmitButton ref={submitRef} />}
        </div>
      </form>
    </div>
  )
}