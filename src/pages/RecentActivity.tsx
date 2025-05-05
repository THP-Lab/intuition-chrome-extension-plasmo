import React from "react"
import { useEventsSubscription } from "~src/graphql/src/generated/subscriptions"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import IntuitionIcon from "~src/components/icons/IntuitionIcon"

const RecentActivity: React.FC = () => {
  const { data, loading, error } = useEventsSubscription()

  const shortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ""

  const renderSenderLink = (rawAddress: string) => {
    const addr = shortAddress(rawAddress)
    return (
      <a
        href={`https://portal.intuition.systems/app/profile/${rawAddress}`}
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
        const isAtomCreate = !e.deposit_id && Boolean(e.atom_id)
        const isTripleCreate = !e.deposit_id && Boolean(e.triple_id)

        // ------ DEPOSIT ATOM ------
        if (isDeposit && e.deposit && !e.deposit.is_triple && e.atom) {
          const senderId = e.deposit.sender.id
          return (
            <div key={idx} className="pt-2 pb-3 border-b">
              <p>
                {renderSenderLink(senderId)}{" "}
                <strong>deposit</strong> :
              </p>
              <AtomCard atom={e.atom} />
            </div>
          )
        }

        // ------ DEPOSIT TRIPLE ------
        if (isDeposit && e.deposit && e.deposit.is_triple && e.triple) {
          const senderId = e.deposit.sender.id
          return (
            <div key={idx} className="pt-2 pb-2 border-b">
              <p>
                {renderSenderLink(senderId)}{" "}
                <strong>deposit</strong> :
              </p>
              <ClaimRowLite claim={e.triple} />
            </div>
          )
        }

        // ------ CREATE ATOM ------
        if (isAtomCreate && e.atom) {
          //)e.atom.creator.id est renseigné par ton fragment AtomMetadata
          const creatorId = e.atom.creator.id
          return (
            <div key={idx} className="pt-2 pb-3 border-b">
              <p>
                {renderSenderLink(creatorId)}{" "}
                <strong>create</strong> atom:
              </p>
              <AtomCard atom={e.atom} />
            </div>
          )
        }

        // ------ CREATE TRIPLE ------
        if (isTripleCreate && e.triple) {
          const creatorId = e.triple.creator_id
          return (
            <div key={idx} className="pt-2 pb-2 border-b">
              <p>
                {renderSenderLink(creatorId)}{" "}
                <strong>create</strong> triple:
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
