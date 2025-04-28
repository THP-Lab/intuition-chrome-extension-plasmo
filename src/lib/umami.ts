export async function umamiCollect(
  eventName: string,
  url: string,
  props: Record<string, any> = {}
) {
  const origin    = process.env.PLASMO_PUBLIC_UMAMI_ORIGIN!
  const websiteId = process.env.PLASMO_PUBLIC_UMAMI_WEBSITE_ID!
  const apiKey    = process.env.PLASMO_PUBLIC_UMAMI_API_KEY

  if (!origin || !websiteId) {
    console.error("Umami origin or website ID missing")
    return
  }


  const body = {
    type: "event",
    payload: {
      name:    eventName,  
      website: websiteId,
      url,
      props
    }
  }

  console.log("[Umami] Sending to /api/send", body)

  try {
    const res = await fetch(`${origin}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      console.error("[Umami] Error", res.status, await res.text())
    } else {
      console.log("[Umami] Success", res.status)
    }
  } catch (e) {
    console.error("[Umami] Fetch failed:", e)
  }
}
