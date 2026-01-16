import React, {useMemo} from 'react'
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { useGetTaggedObjectsQuery } from '@warzieram/graphql'
import { useWalletAddress } from "~src/hooks/useWalletAddress";
import { useAtomIds } from "~src/hooks/useAtomIds";
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { Fingerprint } from 'lucide-react'
import VoteButtons from '~src/components/VoteButtons'
import type { VoteChoice } from '~src/components/VoteButtons'

const SubjectTag: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>()
  const address = useWalletAddress();
  const atomIds = useAtomIds();


  const { data, loading, error } = useGetTaggedObjectsQuery({
    variables: {
      objectId: tagId!,
      predicateId: atomIds.HASHTAG_PREDICATE,
      address: address!
    }
  })

  const triples = data?.triples ?? []

  const sorted = useMemo(() => {
    return triples
      .filter(triple => triple.subject != null)
      .map(triple => {
        const vault = triple.term!
        const counter = triple.counter_term!
        const userFor    = Number(vault.positions?.[0]?.shares ?? 0)
        const userAgainst= Number(counter.positions?.[0]?.shares ?? 0)
        const userVoted = userFor > 0 || userAgainst > 0
        const totalVotes = (vault?.positions_aggregate?.aggregate?.count ?? 0) + (counter.positions_aggregate?.aggregate?.count ?? 0)
        return { triple, userVoted, totalVotes }
      })
      .sort((a, b) => {
        if (a.userVoted && !b.userVoted) return -1
        if (!a.userVoted && b.userVoted) return 1
        return b.totalVotes - a.totalVotes
      })
  }, [triples])

  if (loading) return <p>Loading…</p>
  if (error) {
    console.log("VOICI L'ERREUR :", error)
    return <p className="text-red-600">Error loading</p>
  }


  return (
    <div className="mt-2 space-y-6">
      <section>
        <p className="text-lg font-semibold">
          List of tagged objects
        </p>
        <div className="space-y-4 mt-2">
          {sorted.map(({ triple }) => {
            const subject = triple.subject
            if (!subject) return null
            
            const vault = triple.term!
            const counterVault = triple.counter_term!

            const vaultId = vault.id
            const counterVaultId = counterVault.id

            const numPositionsFor = vault?.positions_aggregate?.aggregate?.count ?? 0
            const numPositionsAgainst = counterVault?.positions_aggregate?.aggregate?.count ?? 0

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
                
                key={subject.term_id}
                className="flex justify-between items-center p-1 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl claims-hover-effect"
              >
                <Link to={`/atoms/${subject.term_id}`} className="flex items-center gap-4">
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
                    <h3 className="text-white font-semibold text-sm max-w-[150px] truncate ">
                      {subject.label}
                    </h3>
                  </div>
              </Link>

                  {vaultId && counterVaultId ? (
                    <div 
                      className="flex flex-col items-end gap-1"
                      onClick={e => {
                        e.stopPropagation(); 
                      }}
                    >
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
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default SubjectTag
