import React, { useEffect } from 'react'
import { useGetTagsObjectsQuery } from '~src/graphql/src'
import AtomCard from '~src/components/AtomCard'
import { Link } from 'react-router-dom'

interface TagObject {
  id: string
  label?: string | null
  image?: string | null
  type: string
}

interface ObjectWithCount {
  obj: TagObject
  count: number
}

const HASHTAG_PREDICATE_ID = 4

const HashtagObjectsPage: React.FC = () => {
  const { data, isLoading, error } = useGetTagsObjectsQuery({
    where: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } },
  })

  if (isLoading) return <p>Chargement…</p>
  if (error)   return <p className="text-red-600">Erreur de chargement</p>

  const grouped = (data?.triples ?? []).reduce<Record<string, ObjectWithCount>>((acc, t) => {
    const o = t.object!
    if (!acc[o.id]) {
      acc[o.id] = { obj: o, count: 0 }
    }
    acc[o.id].count += 1
    return acc
  }, {})

  const items = Object.values(grouped)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Objets taggés avec #{HASHTAG_PREDICATE_ID}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ obj, count }) => (
          <div key={obj.id} className="border rounded-lg p-4">
            <Link to={`/atoms/${obj.id}`}>
              {obj.label}
            </Link>
            <p className="mt-2 text-sm">
              {count} sujet{count > 1 ? 's' : ''} taggué{count > 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HashtagObjectsPage
