import React, { useEffect } from 'react'
import { useGetTagsObjectsQuery, useGetTaggedObjectsQuery } from '~src/graphql/src'
import { Link } from 'react-router-dom'

interface TagObject {
  id: string
  label?: string | null
  image?: string | null
  type: string
}

const HASHTAG_PREDICATE_ID = 4

// Composant pour afficher le count de subjects pour un objet donné
const SubjectCount: React.FC<{ objectId: string }> = ({ objectId }) => {
  const { data, isLoading, error } = useGetTaggedObjectsQuery({
    objectId: Number(objectId),
    predicateId: HASHTAG_PREDICATE_ID,
  })

  if (isLoading) return <span>…</span>
  if (error) return <span>error</span>

  return <span>{data.triples_aggregate.aggregate.count}</span>
}

const HashtagObjectsPage: React.FC = () => {
  // Récupère tous les triples pour le prédicat hashtag
  const { data, isLoading, error } = useGetTagsObjectsQuery({
    distinctOn: ['object_id'],
    where: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } },
  })

  // debug raw triples
  useEffect(() => {
    if (data) console.log('raw triples:', data.triples)
  }, [data])

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p className="text-red-600">Erreur de chargement</p>

  // Extraire les objets (sans compter)
  const objects: TagObject[] = data.triples.map((t: any) => t.object)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Objets taggés avec #{HASHTAG_PREDICATE_ID}
      </h1>


      <ul className="space-y-4">
          {objects.map((obj) => (
          <li key={obj.id} className="border rounded-lg p-4">
            <Link to={`/atoms/${obj.id}`} className="font-semibold hover:underline">
              {obj.label}
            </Link>
            <div className="mt-2 text-sm">
              Sujet(s) ayant taggé cet object: <SubjectCount objectId={obj.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HashtagObjectsPage
