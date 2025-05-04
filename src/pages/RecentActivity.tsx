import React from "react"
import { useEventsSubscription } from "~src/graphql/src/generated/subscriptions"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import IntuitionIcon from "~src/components/icons/IntuitionIcon"

const RecentActivity: React.FC = () => {
  const { data, loading, error } = useEventsSubscription()

  if (error) return <div>Erreur : {error.message}</div>
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center w-full pt-15">
        <IntuitionIcon size={54}/>
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

        // Deposit Atom
        if (isDeposit && e.deposit && !e.deposit.is_triple) {
          return (
            <div key={idx} className="mb-2">
              <p>{e.deposit.sender?.id} deposit on :</p>
              <AtomCard key={e.atom?.id} atom={e.atom!} />
            </div>
          )
        }

        // Deposit Triple
        if (isDeposit && e.deposit && e.deposit.is_triple) {
          return (
            <div key={idx} className="mb-2">
              <p>{e.deposit.sender?.id} deposit on :</p>
              <ClaimRowLite key={e.triple_id} claim={e.triple} />
            </div>
          )
        }

        // Created Atom
        if (isAtomCreate) {
          return (
            <div key={idx} className="mb-2">
              <p>{e.deposit?.sender?.id} create :</p>
              <AtomCard key={e.atom?.id} atom={e.atom!} />
            </div>
          )
        }

        // Created Triple
        if (isTripleCreate) {
          return (
            <div key={idx} className="mb-2">
              <p>{e.deposit?.sender?.id} create on :</p>
              <ClaimRowLite key={e.triple_id} claim={e.triple} />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default RecentActivity
