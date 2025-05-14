import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetTaggedObjectsQuery } from '~src/graphql/src'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { Fingerprint } from 'lucide-react'
import VoteButtons from '~src/components/VoteButtons'
import type { VoteChoice } from '~src/components/VoteButtons'

const HASHTAG_PREDICATE_ID = 4

const SubjectTag: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>()

  const { data, isLoading, error } = useGetTaggedObjectsQuery({
    objectId: Number(tagId),
    predicateId: HASHTAG_PREDICATE_ID,
  })

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p className="text-red-600">Erreur de chargement</p>

  const triples = data?.triples ?? []

  return (
    <div className="mt-2 space-y-6">
      <section>
        <p className="text-lg font-semibold">
          Liste d’objets taggés
        </p>
        <div className="space-y-4 mt-2">
          {triples.map(triple => {
            const subject = triple.subject
            const vault = triple.vault!
            const counterVault = triple.counter_vault!

            const vaultId = vault.id
            const counterVaultId = counterVault.id

            const numPositionsFor = vault.position_count ?? 0
            const numPositionsAgainst = counterVault.position_count ?? 0

            const userStake = Number(vault.positions?.[0]?.shares ?? 0)
            const userCounterStake = Number(counterVault.positions?.[0]?.shares ?? 0)
            const initialVote: VoteChoice | undefined =
              userStake > 0
                ? 'for'
                : userCounterStake > 0
                ? 'against'
                : undefined

            return (
              <div
                key={subject.id}
                className="flex justify-between items-center p-1 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl claims-hover-effect"
              >
                <div className="flex items-center gap-4">
                  {subject.image ? (
                    <ImageWithFallback
                      src={subject.image}
                      alt={subject.label || ''}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Fingerprint className="w-8 h-8" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {subject.label}
                    </h3>
                  </div>
                  {vaultId && counterVaultId ? (
                    <div className="flex flex-col items-end gap-1">
                      <VoteButtons
                        vaultId={BigInt(vaultId)}
                        counterVaultId={BigInt(counterVaultId)}
                        numPositionsFor={numPositionsFor}
                        numPositionsAgainst={numPositionsAgainst}
                        initialVote={initialVote}
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Missing ID</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default SubjectTag
