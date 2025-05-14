import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetAtomQuery } from "@0xintuition/graphql"
import AtomDisplay from '../components/ui/AtomDisplay'
import SubjectTag from '../components/SubjectTag'

const TagDetailPage: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>()

  const {
    data,
    isLoading,
    error,
  } = useGetAtomQuery({
    id: Number(tagId) ?? ""
  })

  if (isLoading) return <p>Loading the atom…</p>
  if (error)      return <p className="text-red-600">Loading error</p>
  if (!data?.atom) return <p>No atoms found for this ID</p>

  return (
    <div className="p-4">
      <Link to="/tags" className="text-sm text-blue-400 hover:underline mb-4 block">
        ← Return to tags
      </Link>
      <AtomDisplay atom={data.atom} />
      <SubjectTag atom={data.atom} />

    </div>
  )
}

export default TagDetailPage
