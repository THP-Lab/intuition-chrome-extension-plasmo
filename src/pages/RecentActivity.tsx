import React from "react"
import { useEventsSubscription } from "@warzieram/graphql"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import IntuitionIcon from "~src/components/icons/IntuitionIcon"
import { useWalletAddress } from "~src/hooks/useWalletAddress";

const INITIAL_LIMIT = 20;

const RecentActivity: React.FC = () => {
  const walletAddress = useWalletAddress();

  const default_img =
      "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  const { data, loading, error } = useEventsSubscription({
    variables: {
      addresses: [walletAddress],
      limit: INITIAL_LIMIT
    }
  })

  console.log("RecentActivity - Raw subscription data:", data)
  console.log("RecentActivity - Loading:", loading)
  console.log("RecentActivity - Error:", error)
  
  if (error) {
    console.error("RecentActivity - Detailed error:", {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
      extraInfo: error.extraInfo
    })
  }
  
  if (data?.events) {
    console.log("RecentActivity - Events count:", data.events.length)
    console.log("RecentActivity - First event:", JSON.stringify(data.events[0], null, 2))
  }

  const shortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ""

  const renderSenderLink = (rawAddress: string) => {
    const addr = shortAddress(rawAddress)
    return (
      <a
        href={`https://portal.intuition.systems/app/atom/${rawAddress}?tab=portfolio`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold hover:underline"
      >
        {addr}
      </a>
    )
  }
  

  if (error) return <div>Erreur : {error.message}</div>
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center w-full">
        <IntuitionIcon size={54} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Live Feed</h1>
      {data.events.map((e, idx) => {
        const isDeposit = Boolean(e.deposit_id)

        // ------ DEPOSIT ATOM ------
        if (isDeposit && e.deposit && e.atom) {
          const senderImg = e.deposit?.sender?.image
          const senderLabel = e.deposit?.sender?.label || e.deposit?.sender?.id
          const senderId = e.deposit?.sender?.id
          console.log("ATOM DEPOSIT EVENT:", {
            sender: e.deposit?.sender,
            atom: e.atom
          })

          return (
            <div key={idx} className="pt-2 pb-3 border-b">
              <p className="flex items-center gap-2">
                <img
                  src={senderImg ?? default_img} 
                  alt={senderLabel}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{renderSenderLink(senderId || senderLabel || "")}<strong> deposit</strong> :</span>
              </p>
              <AtomCard atom={e.atom} />
            </div>
          )
        }

        // ------ DEPOSIT TRIPLE ------
        if (isDeposit && e.deposit && e.triple) {
          const senderImg = e.deposit?.sender?.image
          const senderLabel = e.deposit?.sender?.label || e.deposit?.sender?.id
          const senderId = e.deposit?.sender?.id
          console.log("TRIPLE DEPOSIT EVENT:", {
            sender: e.deposit?.sender,
            triple: e.triple
          })

          return (
            <div key={idx} className="pt-2 pb-2 border-b">
              <p className="flex items-center gap-2">
                <img
                  src={senderImg ?? default_img} 
                  alt={senderLabel}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{renderSenderLink(senderId || senderLabel || "")}<strong> deposit</strong> :</span>
              </p>
                <ClaimRowLite claim={e.triple} />
              
            </div>
          )
        }

        console.log("Unhandled event:", e)
        return null
      })}
    </div>
  )
}

export default RecentActivity
