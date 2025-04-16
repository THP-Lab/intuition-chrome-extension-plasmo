import React from "react"
import { useParams } from "react-router-dom"
import { useGetAtomQuery } from "@0xintuition/graphql"

const AtomDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useGetAtomQuery(
    { id: id ?? "" },
    { enabled: !!id }
  )

  if (isLoading) return <div className="p-4">Loading identity...</div>
  if (isError) return <div className="p-4 text-red-500">Error: {(error as any).message}</div>
  if (!data?.atom) return <div className="p-4">No identity found</div>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{data.atom.label}</h1>
      {data.atom.value?.thing?.description && (
        <p className="text-gray-400">{data.atom.value.thing.description}</p>
      )}
    </div>
  )

}

export default AtomDetailPage;
