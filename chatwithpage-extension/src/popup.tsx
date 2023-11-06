import { LockClosedIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert"
import { Button } from "~components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "~components/ui/card"
import { Input } from "~components/ui/input"
import { useToast } from "~components/ui/use-toast"
import { cn } from "~lib/util"

import "~style.css"
import "~contents/highlight.css"

import { useState } from "react"

type CardProps = React.ComponentProps<typeof Card>

export function CardDemo({ className, ...props }: CardProps) {
  const [apiKey, setApiKey] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const { toast } = useToast()

  // get it from storage
  chrome.storage.local.get(["openAIKey"], function (result) {
    setApiKey(result.openAIKey)
  })

  const showSearch = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      chrome.tabs.sendMessage(
        activeTab.id,
        {
          name: "showSearch",
          showSearch: "true"
        },
        function () {
          window.close()
        }
      )
    })
  }

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Chat with page</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        <CardTitle className="text-5xl text-center">⌘ + G</CardTitle>
      </CardContent>

      <CardContent className="grid gap-4">
        <Button
          variant="link"
          onClick={() => window.open("https://x.com/Karmedge", "_blank")}>
          <CardTitle className="text-xl text-center">Follow Me on X</CardTitle>
        </Button>
      </CardContent>

      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <LockClosedIcon />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              100% private and secure. Is sent straight to OpenAI for generation
            </p>
          </div>
        </div>

        <form
          className="flex w-full max-w-sm items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            chrome.storage.local.set({ openAIKey: e.target[0].value })
            setSubmitted(true)
          }}>
          <Input type="openAI" placeholder="sk-YOURKEY" defaultValue={apiKey} />
          <Button type="submit">
            Save <LockClosedIcon className="ml-2 h-4 w-4" />
          </Button>
        </form>
        {apiKey && submitted && (
          <Alert className="mt-4 animate-fade-in" variant="success">
            <div className="flex items-center space-x-2">
              <AlertTitle>Securely stored</AlertTitle>
              <LockClosedIcon className="animate-bounce h-4 w-4" />
            </div>
            <AlertDescription>
              Your API key is securely stored in your browser and is active
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={showSearch}>
          <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
          Search on current page
        </Button>
      </CardFooter>

      <CardFooter>
        <CardContent>
          {"Created by "}
          <a href="https://x.com/Karmedge" target="_blank">
            <span style={{ textDecoration: "underline" }}>Robert Lukoshka</span>
          </a>
          {" with ❤️ to open source"}
        </CardContent>
      </CardFooter>
    </Card>
  )
}

export default CardDemo
