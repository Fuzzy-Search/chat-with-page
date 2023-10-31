import type { NextApiRequest, NextApiResponse } from "next"
import { getSubscription } from "~/pages/api/_common"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"


const storage = new Storage()


export default async function CheckSupabaseSubscription() {
  try {
    const subscription = await getSubscription()
    const currentTime = new Date().toISOString()
    let activeSubscription = false

    if (!subscription) {
        await storage.set("subscription", "false")
        await storage.set("lastChecked", currentTime)
        activeSubscription = false
    }
    else {
        await storage.set("subscription", "true")
        await storage.set("lastChecked", currentTime)
        activeSubscription = true
    }
    return activeSubscription
  } catch (error) {
    console.log(error)
  }
}

