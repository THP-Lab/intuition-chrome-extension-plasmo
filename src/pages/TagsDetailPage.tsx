import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetAtomQuery } from "@0xintuition/graphql"
import AtomDisplay from '../components/ui/AtomDisplay'

const TagDetailPage: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>()

  const {
    data,
    isLoading,
    error,
  } = useGetAtomQuery({
    id: Number(tagId) ?? ""
  })

  if (isLoading) return <p>Chargement de l’atome…</p>
  if (error)      return <p className="text-red-600">Erreur de chargement</p>
  if (!data?.atom) return <p>Aucun atome trouvé pour cet ID</p>

  return (
    <div className="p-4">
      <Link to="/tags" className="text-sm text-blue-400 hover:underline mb-4 block">
        ← Retour aux tags
      </Link>

      <AtomDisplay atom={data.atom} />

      
    </div>
  )
}

export default TagDetailPage
