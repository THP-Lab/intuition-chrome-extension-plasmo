import { useGetAtomQuery, useGetTriplesByAtomQuery } from "@warzieram/graphql"
import React from "react"
import { useParams } from "react-router-dom"

import { useStorage } from "@plasmohq/storage/hook"

import BackButton from "~/src/components/BackButton"
import TagCreator from "~src/components/TagCreator"
import AtomDisplay from "~src/components/ui/AtomDisplay"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import Tags from "~src/components/ui/Tags"

const HAS_TAG_PREDICATE_ID = "0x49487b1d5bf2734d497d6d9cfcd72cdfbaefb4d4f03ddc310398b24639173c9d"

const AtomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const termId = id ?? "" 
  const shouldFetch = Boolean(termId) 
  const [walletAddress] = useStorage<string>("metamask-account")

  const {
    data: atomData,
    loading: loadingAtom,
    error: errorAtom
  } = useGetAtomQuery({
    variables: { term_id: termId },
    skip: !shouldFetch
  })

  const {
    data: triplesData,
    loading: loadingTriples,
    error: errorTriples,
    refetch: refetchTriples
  } = useGetTriplesByAtomQuery({
    variables: {
      term_id: termId,
      address: walletAddress ?? ""
    }
  })

  const allTriples = React.useMemo(
    () => triplesData?.triples_aggregate?.nodes ?? [],
    [triplesData]
  )

  const tags = React.useMemo(() => {
    const raw = allTriples
      .filter((t) => t.predicate?.term_id === HAS_TAG_PREDICATE_ID)
      .map((t) => t.object)
    return Array.from(new Map(raw.map((tag) => [tag.term_id, tag])).values())
  }, [allTriples])

  const claims = React.useMemo(
    () =>
      allTriples.map((t) => ({
        ...t,
        vault: {
          term_id: t.term?.id,
          positions: t.term?.positions,
          positions_aggregate: t.term?.positions_aggregate
        },
        counter_vault: {
          term_id: t.counter_term?.id,
          positions: t.counter_term?.positions,
          positions_aggregate: t.counter_term?.positions_aggregate
        }
      })),
    [allTriples]
  )
  const error = errorAtom || errorTriples;

  if (!shouldFetch) {
    return <div className="p-4">Identifiant invalide</div>
  }
  if (loadingAtom) {
    return <div className="p-4">Loading…</div>
  }
  if (errorAtom) {
    return (
      <div className="p-4 text-red-500">Error : {(error as any)?.message}</div>
    )
  }
  if (!atomData?.atom) {
    return <div className="p-4">No atom found</div>
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
              <ClaimRowLite key={`${claim.term_id}-${idx}`} claim={claim} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AtomDetailPage
