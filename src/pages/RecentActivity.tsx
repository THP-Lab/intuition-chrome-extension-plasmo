import React from "react"
import { useEventsSubscription } from "~src/graphql/src/generated/subscriptions"
import AtomCard from "~src/components/AtomCard"

const RecentActivity: React.FC = () => {
  const { data, loading, error } = useEventsSubscription()

  if (error) return <div className="text-red-600">Erreur : {error.message}</div>
  if (loading || !data) return <div>Chargement…</div>

  // Ne garder que les événements relatifs aux atoms ou triples
  const relevantEvents = data.events.filter(
    (e) => Boolean(e.deposit_id) || Boolean(e.atom_id) || Boolean(e.triple_id)
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Activité Récente</h1>
      <div className="space-y-4">
        {relevantEvents.map((e, idx) => {
          const isDepositOnAtom = Boolean(e.deposit_id) && Boolean(e.atom)
          const isAtomCreated   = Boolean(e.atom_id) && !e.deposit_id

          if (isDepositOnAtom || isAtomCreated) {
            const atom = e.atom!
            // Déterminer l'action et l'adresse de l'exécutant
            const actionLabel = isDepositOnAtom ? 'Adresse a déposé sur' : 'Adresse a créé sur'
            const executor    = isDepositOnAtom ? e.deposit?.sender.id! : e.atom!.creator.id

            return (
              <div key={idx}>
                <p className="mb-2">
                  <strong>{actionLabel} :</strong> {executor}
                </p>
                {/* Affichage de la carte Atom */}
                <AtomCard key={atom.id} atom={atom} tags={atom.tags} />
              </div>
            )
          }

          // Placeholder pour futurs triples
          return null
        })}
      </div>
    </div>
  )
}

export default RecentActivity
