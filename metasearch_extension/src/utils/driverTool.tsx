import { driver } from "driver.js";
import { Storage } from "@plasmohq/storage"

const storage = new Storage()


export const driverObj = driver({
  showProgress: true,
  overlayOpacity: 0.1,
  steps: [
    {element: 'iframe', popover: { title: 'Search here 👉',  description: 'Start typing text to try it out', side: "left", align: 'start' }},
    {element: 'iframe', popover: { title: 'Click on the result', description: 'The page will move to the element and highlight it!', side: "left", align: 'center'}},
    {popover: { title: 'Trigger a shortcut CMD+E', description: 'This will turn on and off the search bar!' }}
  ],
  onDestroyed: async (element, step, options) => {
    await storage.set("onboarded", true)
  }
});