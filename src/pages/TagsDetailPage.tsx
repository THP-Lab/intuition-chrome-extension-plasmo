import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetAtomQuery } from "@warzieram/graphql"
import AtomDisplay from '../components/ui/AtomDisplay'
import SubjectTag from '../components/SubjectTag'
import BackButton from '~/src/components/BackButton'

const TagDetailPage: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>()

  const {
    data,
    loading,
    error,
  } = useGetAtomQuery({ 
    variables: { term_id: tagId! } 
  })

  if (loading) return <p>Loading the atom…</p>
  if (error)      return <p className="text-red-600">Loading error</p>
  if (!data?.atom) return <p>No atoms found for this ID</p>
  
  return (
    <div className="p-4">
      <BackButton />
      <AtomDisplay atom={data.atom} />
      <SubjectTag atom={data.atom} />

    </div>
  )
}

export default TagDetailPage
