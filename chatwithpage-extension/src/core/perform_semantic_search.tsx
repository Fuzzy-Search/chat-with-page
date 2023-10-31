import { sendToBackground } from "@plasmohq/messaging";
import { processPage } from "src/core/process_page"


export async function performSemanticSearch(
    searchQuery: string
): Promise<any[]> {
    // because there could be errors in the background script, we need to wrap this in a try/catch
    console.log("performing semantic search on " + searchQuery);
    try {
        let searchResults = null;
        let attempts = 0;
        while (!searchResults && attempts < 30) {
          searchResults = await sendToBackground({
            name: "search",
            body: {
              text: searchQuery,
              url: window.location.href
            }
          });
          if (!searchResults?.searchResult?.length) {
            searchResults = null;
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        if (!searchResults) {
            // 
            await processPage(window.location.href);
            console.log("processing page");
          throw new Error("No search results");
        }
        const processedSearchResults = processSearchResults(searchResults);
        console.log(processedSearchResults);
        return processedSearchResults;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export function processSearchResults(
    searchResults: any
    ): any[] {
    const rawResults = searchResults.searchResult
    let uniqueResults = [];
    if (rawResults) {
      const seen = new Set();
      uniqueResults = rawResults.reduce((acc, result) => {
        if (!seen.has(result.object.name)) {
          seen.add(result.object.name);
          acc.push(result);
        }
        return acc;
      }, []);
    }
    return uniqueResults;
}