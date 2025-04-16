import { useGetAtomQuery } from "@0xintuition/graphql"
import React from "react"
import { useParams } from "react-router-dom"

import AtomDisplay from "~src/components/ui/AtomDisplay"

const AtomDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useGetAtomQuery(
    { id: id ?? "" },
    { enabled: !!id }
  )

  if (isLoading) return <div className="p-4">Loading identity...</div>
  if (isError)
    return (
      <div className="p-4 text-red-500">Error: {(error as any).message}</div>
    )
  if (!data?.atom) return <div className="p-4">No identity found</div>

  return (
    <div className="p-4">
      <AtomDisplay atom={data.atom} />
    </div>
  )
}

export default AtomDetailPage
