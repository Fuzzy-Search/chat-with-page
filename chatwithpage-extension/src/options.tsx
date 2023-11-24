import { RocketIcon } from "@radix-ui/react-icons"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert"
import { Button } from "~components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~components/ui/card"
import { Input } from "~components/ui/input"

import "~style.css" // Make sure this path is correct for your project

function AuthenticationPage() {
  const [openAIKey, setOpenAIKey] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // Function to handle the submit action
  const handleSubmit = () => {
    chrome.storage.local.set({ openAIKey: openAIKey })
    console.log("OpenAI Key saved successfully to, ", openAIKey)
    setShowSuccess(true)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Chat with page</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <CardTitle className="text-5xl text-center">⌥/Alt + G</CardTitle>
        </CardContent>
        <span>this page will not work as its part of the extension</span>
      </Card>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Save your OpenAI Key
        </h2>
        <Input
          type="text"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
          className="input-field mb-4 p-2 w-full border border-gray-300 rounded"
          placeholder="Enter OpenAI Key"
        />
        <Button
          className="w-full py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}>
          Submit
        </Button>
        {showSuccess && (
          <Alert className="mt-4">
            <AlertTitle className="text-lg font-bold">Success</AlertTitle>
            <AlertDescription>OpenAI Key saved successfully!</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default AuthenticationPage
