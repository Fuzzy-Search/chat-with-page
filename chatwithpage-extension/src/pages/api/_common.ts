import { supabase } from "~core/supabase"

export const getSubscription = async () => {
  try {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .maybeSingle()
      .throwOnError()
    return subscription
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
