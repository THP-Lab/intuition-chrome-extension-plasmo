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
    { enabled: Boolean(uri) }
  )

  useEffect(() => {
    if (isLoading) {
      setStatus("loading")
    } else if (data?.atoms?.length > 0) {
      setStatus("found")
    } else {
      setStatus("not_found")
    }
  }, [isLoading, data])

  return { status }
}
