import React from "react"
import { useEventsSubscription } from "~src/graphql/src/generated/subscriptions"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import IntuitionIcon from "~src/components/icons/IntuitionIcon"
import { useStorage } from "@plasmohq/storage/dist/hook"

const INITIAL_LIMIT = 20;

const RecentActivity: React.FC = () => {
  const [walletAddress] = useStorage<string>("metamask-account", "")

  const default_img =
      "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  const { data, loading, error } = useEventsSubscription({
    variables: {
      addresses: walletAddress,
      limit: INITIAL_LIMIT
    }
  })

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
        const isAtomCreate = !e.deposit_id && Boolean(e.atom?.id)
        const isTripleCreate = !e.deposit_id && Boolean(e.triple?.id)

        // ------ DEPOSIT ATOM ------
        if (isDeposit && e.deposit && !e.deposit.is_triple && e.atom) {
          const senderImg = e.deposit.sender.image
          const senderLabel = e.deposit.sender.label

          return (
            <div key={idx} className="pt-2 pb-3 border-b">
              <p className="flex items-center gap-2">
                <img
                  src={senderImg ?? default_img} 
                  alt={senderLabel}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{renderSenderLink(senderLabel)}<strong> deposit</strong> :</span>
                
              </p>
              <AtomCard atom={e.atom} />
            </div>
          )
        }

        // ------ DEPOSIT TRIPLE ------
        if (isDeposit && e.deposit && e.deposit.is_triple && e.triple) {
          const senderImg = e.deposit.sender.image
          const senderLabel = e.deposit.sender.label
        console.log("ID DU PREDICATE:", e.triple.predicate.id)

          return (
            <div key={idx} className="pt-2 pb-2 border-b">
              <p className="flex items-center gap-2">
                <img
                  src={senderImg ?? default_img} 
                  alt={senderLabel}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{renderSenderLink(senderLabel)}<strong> deposit</strong> :</span>
              </p>
              
                <ClaimRowLite claim={e.triple} />
              
            </div>
          )
        }

        // ------ CREATE ATOM ------
        if (isAtomCreate && e.atom) {
          //)e.atom.creator.id est renseigné par ton fragment AtomMetadata
          const creatorLabel = e.atom.creator.label
          const creatorImg = e.atom.creator.image

          return (
            <div key={idx} className="pt-2 pb-3 border-b">
              <p className="flex items-center gap-2">
                <img
                  src={creatorImg ?? default_img} 
                  alt={creatorLabel}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{renderSenderLink(creatorLabel)}<strong> create</strong> :</span>
              </p>
              <AtomCard atom={e.atom} />
            </div>
          )
        }

        // ------ CREATE TRIPLE ------
        if (isTripleCreate && e.triple) {
          const creatorLabel = e.triple.creator.label
          const creatorImg = e.triple.creator.image

          return (
            <div key={idx} className="pt-2 pb-2 border-b">
              <p className="flex items-center gap-2">
                <img
                  src={creatorImg ?? default_img} 
                  alt={creatorLabel}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{renderSenderLink(creatorLabel)}<strong> create</strong> :</span>
              </p>
              <ClaimRowLite claim={e.triple} />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default RecentActivity
