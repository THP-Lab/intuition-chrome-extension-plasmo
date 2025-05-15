import { useEffect, useState } from "react"
import { useSubscription } from "@apollo/client"
import { EventsDocument } from "~src/graphql/src/generated/subscriptions"

export const useEventNotification = () => {
  const [hasNotification, setHasNotification] = useState(false)

  const { data } = useSubscription(EventsDocument, {
    variables: {
      addresses: [],
      limit: 1
    }
  })

  useEffect(() => {
    const event = data?.events?.[0]
    const type = event?.type?.toLowerCase?.()
    if (type?.includes("claim") || type?.includes("atom")) {
     
      setHasNotification(true)
    }
  }, [data])

  return { hasNotification, reset: () => setHasNotification(false) }
}
