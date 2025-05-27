import { useGetAtomQuery } from "@0xintuition/graphql"
import React from "react"
import { useParams } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook"
import AtomDisplay from "~src/components/ui/AtomDisplay"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useGetTriplesByAtomQuery } from "@warzieram/graphql"
import TagCreator from "~src/components/TagCreator"
import Tags from "~src/components/ui/Tags"
import BackButton from "~/src/components/BackButton"

const HAS_TAG_PREDICATE_ID = 4

const AtomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const parsedId = Number(id)
  const shouldFetch = !isNaN(parsedId)
  const [walletAddress] = useStorage<string>("metamask-account")

  const {
    data: atomData,
    isLoading: loadingAtom,
    isError: errorAtom,
    error
  } = useGetAtomQuery(
    { term_id: parsedId },
    { enabled: shouldFetch }
  )

  const {
    data: triplesData,
    isLoading: loadingTriples,
    isError: errorTriples,
    refetch: refetchTriples
  } = useGetTriplesByAtomQuery(
    {
      term_id: parsedId,
      address: walletAddress ?? ""
    },
    { enabled: shouldFetch && !!walletAddress }
  )

  const allTriples = React.useMemo(
    () => triplesData?.triples_aggregate?.nodes ?? [],
    [triplesData]
  )

  const tags = React.useMemo(() => {
    const raw = allTriples
      .filter(t => t.predicate?.term_id === HAS_TAG_PREDICATE_ID)
      .map(t => t.object)
    return Array.from(new Map(raw.map(tag => [tag.term_id, tag])).values())
  }, [allTriples])


  const claims = React.useMemo(
    () =>
      allTriples.map(t => ({
        ...t,
        vault: {
          term_id:   t.term?.id,
          positions: t.term?.positions,
          positions_aggregate: t.term?.positions_aggregate
        },
        counter_vault: {
          term_id:   t.counter_term?.id,
          positions: t.counter_term?.positions,
          positions_aggregate: t.counter_term?.positions_aggregate
        }
      })),
    [allTriples]
  )


  if (!shouldFetch) {
    return <div className="p-4">Identifiant invalide</div>
  }
  if (loadingAtom) {
    return <div className="p-4">Loading…</div>
  }
  if (errorAtom) {
    return (
      <div className="p-4 text-red-500">
        Error : {(error as any)?.message}
      </div>
    )
  }
  if (!atomData?.atom) {
    return <div className="p-4">No atoms found</div>
  }


  return (
    <div className="p-4 space-y-6">
      <BackButton />

      <AtomDisplay
        atom={atomData.atom}
        tagsSection={
          <div className="flex flex-wrap gap-2 items-center">
            <Tags tags={tags} />
            <TagCreator
              subjectAtom={atomData.atom}
              onTagCreated={() => refetchTriples()}
            />
          </div>
        }
      />

      <section>
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold flex-1">
            Triples ({claims.length})
          </h2>
          {loadingTriples && <span className="text-sm">Loading…</span>}
          {errorTriples && (
            <span className="text-sm text-red-500">Error loading</span>
          )}
        </div>

        {claims.length === 0 ? (
          <p className="text-sm text-gray-500">
            No triple associated with this atom.
          </p>
        ) : (
          <div className="space-y-3">
            {claims.map((claim, idx) => (
              <ClaimRowLite
                key={`${claim.term_id}-${idx}`}
                claim={claim}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AtomDetailPage
