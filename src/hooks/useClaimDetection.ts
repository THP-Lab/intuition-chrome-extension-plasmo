import { useEffect, useState } from "react"
import { useGetClaimsByUriQuery } from "~src/graphql/src"

export type Status = "loading" | "found" | "not_found"

export const useClaimDetection = (
  uri: string,
  address?: string
): { status: Status } => {
  const [status, setStatus] = useState<Status>("loading")

  const { data, isLoading } = useGetClaimsByUriQuery(
    { uri, address },
    { enabled: Boolean(uri) && Boolean(address) }
  )

  useEffect(() => {
  

    if (isLoading) {
      setStatus("loading")
    } else {
      const atoms = data?.atoms ?? []

      const foundClaim = atoms.some((atom) => {
        const subjectCount =
          atom?.as_subject_claims_aggregate?.aggregate?.count ?? 0
        const objectCount =
          atom?.as_object_claims_aggregate?.aggregate?.count ?? 0
        return subjectCount > 0 || objectCount > 0
      })

      
      setStatus(foundClaim ? "found" : "not_found")
    }
  }, [isLoading, data, uri, address])

  return { status }
}
