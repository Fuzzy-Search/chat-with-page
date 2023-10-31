import type { PlasmoCSConfig } from "plasmo"
import { supabase } from "~core/supabase"

 
export const config: PlasmoCSConfig = {
  matches: ["https://meta-payments.vercel.app/*", "http://0.0.0.0:3000/*"],
  all_frames: true
}


let intervalId = setInterval(() => {
  const access_token = document.querySelector(".access")?.textContent
  if (access_token) {
    const refresh_token = document.querySelector(".refresh")?.textContent
    console.log("access_token", refresh_token)
    supabase.auth.setSession({
      access_token,
      refresh_token
    })
    clearInterval(intervalId)
  }
}, 1000)
  