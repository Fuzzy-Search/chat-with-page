import { sendToBackground } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import { processText, highlightText, clearHighlights }  from "~utils/tools"



import CheckSupabaseSubscription from "~pages/api/check-subscription";





const storage = new Storage()

export async function getUsageCount(): Promise<number> {
  let count = await storage.get("count") as number
  let month = await storage.get("month") as number
  if (!count || count === null) {
    count = 0
    month = new Date().getMonth()
  }
  const currentMonth = new Date().getMonth()
  if (month !== currentMonth) {
    month = currentMonth
    count = 0
    await storage.set("count", count)
    await storage.set("month", month)
  }
  return count
}

export async function checkSubscription(): Promise<boolean> {
  console.log("Subscription Status ...")
  const subscription = await storage.get("subscription")
  const lastChecked = await storage.get("lastChecked")
  const lastCheckedDate = new Date(lastChecked).getTime()
  const currentTime = new Date().getTime()
  const diffTime = Math.abs(currentTime - lastCheckedDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (subscription === "true"){
    if (diffDays < 3) {
      return true
    } else {
      if (await CheckSupabaseSubscription()) {
        return true
      }
      else {
        return false
      }
    }

  } else {
    if (await CheckSupabaseSubscription()) {
      await storage.set("subscription", "true")
      await storage.set("lastChecked", new Date().toISOString())
      return true
    } else {
      return false
    }
  }
}


// export async function checkSubscription(): Promise<boolean> {
export async function handleSemanticSearch(
    searchText: string,
    setProgress: (progress: number) => void,
    setIsSearching: (isSearching: boolean) => void,
    intervalId: number,
    setIntervalId: (intervalId: number) => void,
    onboarding_page: boolean,
    driverObj: any,
    setSearchResults: (searchResults: any) => void,
    setSelectedResultIndex: (selectedResultIndex: number) => void,
    ):Promise<void> {
        if (intervalId) {
            clearInterval(intervalId);
          }

    let local_progress = 20
    
    setIsSearching(true)
    let interval = setInterval(() => {
      local_progress += 6;
      setProgress(local_progress);
    }, 750);

    try {
      let searchResult = null;
      let attempts = 0;
      setSelectedResultIndex(0)
      while (!searchResult && attempts < 30) {
        searchResult = await sendToBackground({
          name: "search",
          body: {
            text: searchText,
            url: window.location.href
          }
        });
        if (!searchResult || !searchResult.searchResult || searchResult.searchResult.length === 0) {
          searchResult = null;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      if (searchResult) {
        processSearchResult(
            searchResult,
            setSearchResults,
            onboarding_page,
            driverObj
        );
        clearInterval(interval);
        setProgress(0);
      }
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      console.error(error)
    }
    setIsSearching(false)
  }


export function handleInputChange(
  event,
  setSearchInput: (searchInput: string) => void,
  searchTimeout: any,
  searchInput: string,
  setSearchResults: (searchResults: any) => void,
  setIsSearching: (isSearching: boolean) => void,
  setFullTextResults: (fullTextResults: any) => void,
  intervalId: number,
  setIntervalId: (intervalId: number) => void,
  setProgress: (progress: number) => void,
  onboarding_page: boolean,
    driverObj: any,
    setSelectedResultIndex: (selectedResultIndex: number) => void,
): void {

    setSearchResults([])
    setFullTextResults([])
  const inputValue = event.target.value
  setSearchInput(inputValue)
  clearHighlights()
  if (searchTimeout.current) clearTimeout(searchTimeout.current)
  searchTimeout.current = setTimeout(async () => {
    if (inputValue.length > 0) {
      if (inputValue !== searchInput) {
        setSearchInput(inputValue)
        console.log(inputValue)
        // full text part
        if (inputValue.length > 1) {
            highlightText(inputValue, { accuracy: "exact", className: "full-text"})
        } else {
            highlightText(inputValue, { accuracy: "exact", className: "full-text"})
        }
        let results = document.querySelectorAll(".full-text")
        let rr = []
        let uniqueTextContents = []
        results.forEach((result) => {
          let textContentLower = result.textContent.toLowerCase()
          if (!uniqueTextContents.includes(textContentLower)) {
            rr.push({ object: { name: result.textContent } })
            uniqueTextContents.push(textContentLower)
          }
        })
        setFullTextResults(rr)
        setIsSearching(false)

        await handleSemanticSearch(
          inputValue,
          setProgress,
          setIsSearching,
          intervalId,
          setIntervalId,
          onboarding_page,
          driverObj,
          setSearchResults,
          setSelectedResultIndex
        )
      }
    } else {
      setSearchResults([])
      setFullTextResults([])
      setIsSearching(false)
      setSelectedResultIndex(0)
    }
  }, 150)
}


export function processSearchResult(
    searchResult: any,
    setSearchResults: (searchResults: any) => void,
    onboarding_page: boolean,
    driverObj: any,
    ): void {
    const rawResults = searchResult.searchResult
    if (rawResults) {
      const seen = new Set();
      const uniqueResults = rawResults.reduce((acc, result) => {
        if (!seen.has(result.object.name)) {
          seen.add(result.object.name);
          acc.push(result);
        }
        return acc;
      }, []);
      setSearchResults(uniqueResults)
      for (let i = 0; i < uniqueResults.length; i++) {
        highlightText(uniqueResults[i].object.name, { accuracy: "exact"})
      }
    }
  }