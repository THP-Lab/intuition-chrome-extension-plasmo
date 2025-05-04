import React from "react"
import { useEventsSubscription } from "~src/graphql/src/generated/subscriptions"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"

const RecentActivity: React.FC = () => {
  const { data, loading, error } = useEventsSubscription()

  if (error) return <div>Erreur : {error.message}</div>
  if (loading || !data) return <div>Chargement…</div>

  return (
    <div className="p-4">
      <h2>Activité Récente (Brut)</h2>
      {data.events.map((e, idx) => {

        const isDeposit = Boolean(e.deposit_id)
        const isAtomCreate = !e.deposit_id && Boolean(e.atom_id)
        const isTripleCreate = !e.deposit_id && Boolean(e.triple_id)

        // Deposit Atom
        if (isDeposit && e.deposit && !e.deposit.is_triple) {
          return (
            <div key={idx} className="mb-2">
              <p>{e.deposit.sender?.id} deposit on :</p>
              <AtomCard key={e.atom?.id} atom={e.atom} />
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
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <p><strong>Type:</strong> {e.type}</p>
              <p><strong>Atom ID:</strong> {e.atom_id}</p>
              <pre>
                {JSON.stringify(e.atom, null, 2)}
              </pre>
            </div>
          )
        }

        // Created Triple
        if (isTripleCreate) {
          return (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <p><strong>Type:</strong> {e.type}</p>
              <p><strong>Triple ID:</strong> {e.triple_id}</p>
              <pre>
                {JSON.stringify(e.triple, null, 2)}
              </pre>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default RecentActivity
