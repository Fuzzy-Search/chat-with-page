"use client"

import {
  ExclamationTriangleIcon,
  LockClosedIcon,
  ReloadIcon
} from "@radix-ui/react-icons"
import { useEffect, useRef, useState } from "react"
import { Button } from "src/components/ui/button"
import { performSemanticSearch } from "src/core/perform_semantic_search"

import { usePort } from "@plasmohq/messaging/hook"

import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert"
import { Input } from "~components/ui/input"
import { clearHighlights, highlightText } from "~utils/tools"

import SubmitButton from "./submitButton"

interface SearchFormProps {
  initialPrompt?: string
}

function searchResultsToText(searchResults: any[], limit: number = 6) {
  return (
    "Context:\n" +
    searchResults
      .slice(0, limit)
      .map((result, index) => `doc ${index + 1}. "${result.object.name}"`)
      .join("\n")
  )
}

export const SearchOnPageForm = ({ initialPrompt }: SearchFormProps) => {
  const submitRef = useRef<React.ElementRef<"button">>(null)

  const [input, setInput] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [openAIKey, setOpenAIKey] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const mailPort = usePort("aiport")

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)
    setInput(input)
    const results = await performSemanticSearch(input)
    setSearchResults(results.slice(0, 5))
    const searchResultsText = searchResultsToText(results)
    mailPort.send({
      context: searchResultsText,
      query: input
    })
  }

  useEffect(() => {
    if (mailPort.data?.message) {
      setIsSubmitting(false)
    }
    setIsError(false)
  }, [mailPort.data?.message])

  useEffect(() => {
    if (mailPort.data?.error !== undefined && mailPort.data?.error !== null) {
      console.log(mailPort.data)
      setIsError(true)
    } else {
      setIsError(false)
    }
  }, [mailPort.data?.error])

  const generatedAnswer = mailPort.data?.message
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    clearHighlights()
    searchResults.forEach((result) => {
      highlightText(result.object.name, { className: "AIsearch" })
    })
  }, [searchResults])

  const handleOpenAIsubmit = (e) => {
    e.preventDefault()
    chrome.storage.local.set({ openAIKey: openAIKey })
    console.log("OpenAI Key saved successfully to, ", openAIKey)
    setShowSuccess(true)
    setIsError(false)
  }
  const handleKeyChange = (event) => {
    setOpenAIKey(event.target.value)
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "50px",
        width: "100%",
        maxHeight: "300px",
        overflowY: "scroll"
      }}>
      {!isError && (
        <div>
          <div
            className="space-y-10 my-10"
            style={{ maxHeight: "calc(100% - 50px)" }}>
            {generatedAnswer && (
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition border"
                  key={generatedAnswer}
                  style={{ fontFamily: "Arial, sans-serif" }}>
                  <div className="text-lg">
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      {generatedAnswer}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={onSubmit}
            className="AIsearch bg-black rounded-xl shadow-lg h-14 flex flex-row px-1"
            style={{
              width: "75%",
              position: "fixed",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)"
            }}>
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
              {isSubmitting ? (
                <ReloadIcon
                  className="mr-2 h-4 w-4 animate-spin"
                  style={{ color: "white" }}
                />
              ) : (
                <SubmitButton ref={submitRef} />
              )}
            </div>
          </form>
        </div>
      )}
      {isError && (
        <div
          style={{
            position: "fixed",
            bottom: "50px",
            width: "100%",
            maxHeight: "400px",
            overflowY: "scroll"
          }}>
          <div className="my-5" style={{ maxHeight: "calc(100% - 50px)" }}>
            <div className="space-y-4 flex flex-col items-center justify-center max-w-xl mx-auto border p-4 bg-opacity-50 backdrop-filter backdrop-blur-md">
              {/* Display the error message */}
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Error with openAI key.</AlertDescription>
              </Alert>
              {/* Input form for OpenAI key */}
              <form
                onSubmit={handleOpenAIsubmit}
                className="w-full flex flex-col items-center">
                <Input
                  type="text"
                  value={openAIKey}
                  onChange={handleKeyChange}
                  className="input-field" // Make sure this class is styled in your CSS
                  placeholder="Enter your OpenAI Key here"
                  style={{
                    margin: "5px 0",
                    padding: "12px",
                    fontSize: "18px"
                  }}
                />
                <Button
                  type="submit"
                  style={{ fontSize: "18px", padding: "10px 20px" }}>
                  Save OpenAI Key
                </Button>{" "}
              </form>
            </div>
            {showSuccess && (
              <div className="flex items-center space-x-2 rounded-md border bg-opacity-50 backdrop-filter backdrop-blur-md">
                <Alert className="mt-1 animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <AlertTitle>Securely stored</AlertTitle>
                    <LockClosedIcon className="animate-bounce h-4 w-4" />
                  </div>
                  <AlertDescription>
                    Your API key is securely stored in your browser and is
                    active
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
