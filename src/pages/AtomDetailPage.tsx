import { useGetAtomQuery } from "@0xintuition/graphql"
import React from "react"
import { useParams } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook"
import AtomDisplay from "~src/components/ui/AtomDisplay"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useGetClaimsByAtomQuery } from "~src/graphql/src"
import TagCreator from "~src/components/TagCreator"
import Tags from "~src/components/ui/Tags"
import BackButton from '~/src/components/BackButton'

const AtomDetailPage = () => {
  const params = useParams<{ id: string }>()
  const [stableId, setStableId] = React.useState<string | undefined>(params.id)

  React.useEffect(() => {
    if (params.id) {
      setStableId(params.id)
    }
  }, [params.id])

  const parsedAtomId = stableId ? Number(stableId) : null
  const [walletAddress] = useStorage<string>("metamask-account")
  const [hasRefetched, setHasRefetched] = React.useState(false)

  const shouldRenderAtom = stableId !== null && !isNaN(Number(stableId))

  const { data, isLoading, isError, error } = useGetAtomQuery(
    { id: stableId ?? "" },
    { enabled: shouldRenderAtom }
  )

  const {
    data: claimsData,
    isLoading: isLoadingClaims,
    isError: isClaimsError,
    refetch: refetchClaims
  } = useGetClaimsByAtomQuery(
    { id: parsedAtomId ?? 0, address: walletAddress },
    { enabled: false }
  )

  React.useEffect(() => {
    setHasRefetched(false)
  }, [parsedAtomId])

  React.useEffect(() => {
    if (shouldRenderAtom && walletAddress && !hasRefetched) {
      console.log("🔁 Refetch claims triggered")
      refetchClaims()
      setHasRefetched(true)
    }
  }, [shouldRenderAtom, walletAddress, hasRefetched, refetchClaims])
  

  const claims =
  claimsData?.claims_aggregate?.nodes.map((claim) => ({
    ...claim,
    ...claim.triple
  })) ?? []

  const claimsWithoutDuplicates = claims.filter((claim, index, self) => index === self.findIndex((c) => 
    c.subject?.id === claim.subject?.id &&
    c.predicate?.id === claim.predicate?.id &&
    c.object?.id === claim.object?.id
  )
 )

  const rawTags = claimsWithoutDuplicates
    .filter(c => c.predicate.label === "has tag")
    .map(c => c.object)

  const tags: typeof rawTags = Array.from(
    new Map(rawTags.map(tag => [tag.id, tag])).values()
  )

  console.log("walletAddress:", walletAddress)
  console.log("atomId:", stableId)
  console.log("ClaimsData", claimsData?.claims_aggregate?.nodes)
  console.log("Claims:", claims)
  console.log("claimsWithoutDuplicates:", claimsWithoutDuplicates)
  console.log("Tags :", tags);


  if (!stableId || isNaN(parsedAtomId)) {
  return <div className="p-4">Loading...</div>
}

  if (isLoading) return <div className="p-4">Loading identity...</div>
  if (isError) return <div className="p-4 text-red-500">Error: {(error as any)?.message}</div>
  if (!data?.atom) return <div className="p-4">No identity found</div>

  return (
    <div className="p-4">
      <BackButton />

      <AtomDisplay
        atom={data.atom}
        tagsSection={
          <div className="gap-2">
            <Tags tags={tags} />
            <div className="pt-2">
              <TagCreator 
                subjectAtom={data.atom}
                onTagCreated={() => refetchClaims()}
              />
            </div>
          </div>
        }
      />
      
      <div>
        <div className="flex items-center mt-2 mb-1">
          <span className="text-sm text-gray-400">Claims</span>
          <span className="px-2 py-0.5 text-xs font semi-bold text-white bg-gray-700 rounded-full ml-2">
            {claimsData?.claims_aggregate?.aggregate?.count ?? 0}
          </span>
        </div>
        {isLoadingClaims ? (
          <p className="mt-2 text-sm text-muted-foreground">Loading related claims...</p>
        ) : isClaimsError ? (
          <p className="mt-2 text-sm text-red-500">Error loading claims</p>
        ) : (
          <div className="mt-3 space-y-2">
            {claimsWithoutDuplicates.map((claim, index) => (
              <ClaimRowLite key={`${claim.id}-${index}`} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AtomDetailPage