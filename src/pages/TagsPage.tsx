import React from 'react'
import { Link } from 'react-router-dom'
import { useGetListsTagsQuery } from '~src/graphql/src'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { Fingerprint } from 'lucide-react'

const HASHTAG_PREDICATE_ID = 4

const HashtagObjectsPage: React.FC = () => {
  const { data, isLoading, isError, error } = useGetListsTagsQuery(
    {
      where: {
        _and: [
          { as_object_triples: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } } }
        ]
      },
      triplesWhere: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } },
      limit: 18,
      offset: 0,
      orderBy: [
        { as_object_triples_aggregate: { count: 'desc' } }
      ]
    },
    {
      refetchOnWindowFocus: false
    }
  )

  if (isLoading) return <p>Loading...</p>
  if (isError)   return <p className="text-red-600">Error : {String(error)}</p>

  const total = data.atoms_aggregate.aggregate?.count

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold mb-4">
        Tags list ({total})
      </h1>

      {data?.atoms.map(atom => {
        const count = atom.as_object_triples_aggregate.aggregate?.count
        return (
          <Link
            key={atom.id}
            to={`/tags/${atom.id}`}
            className="flex justify-between items-center p-2 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-2 claims-hover-effect"
          >
            <div className="flex items-center gap-4">
              {atom.image ? (
                <ImageWithFallback
                  src={atom.image}
                  alt={atom.label || ''}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Fingerprint className="w-10 h-10" />
                </div>
              )}
              <div>
                <h3 className="text-white font-semibold text-base">
                  {atom.label}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {atom.value?.thing?.description?.slice(0, 70) ?? ''}…
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-400">{count} tagged</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default HashtagObjectsPage
