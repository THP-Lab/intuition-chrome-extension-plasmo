import React, { useEffect } from 'react'
import { useGetTagsObjectsQuery, useGetCountTaggedObjectsQuery } from '~src/graphql/src'
import { Link } from 'react-router-dom'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { Fingerprint } from "lucide-react"

interface TagObject {
  id: string
  label?: string | null
  image?: string | null
  type: string
  value?: {
    thing?: {
      description?: string | null
    }
    person?: {
      description?: string | null
    }
  }
}

const HASHTAG_PREDICATE_ID = 4

const SubjectCount: React.FC<{ objectId: string }> = ({ objectId }) => {
  const { data } = useGetCountTaggedObjectsQuery({
    objectId: Number(objectId),
    predicateId: HASHTAG_PREDICATE_ID,
  })
  const count = data?.triples_aggregate.aggregate.count ?? 0
  return <span className="ml-2 text-sm text-gray-400">{count}</span>
}


const HashtagObjectsPage: React.FC = () => {
  
  const { data, isLoading, error } = useGetTagsObjectsQuery({
    distinctOn: ['object_id'],
    where: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } },
  })

  useEffect(() => {
    if (data) console.log('raw triples:', data.triples)
  }, [data])

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p className="text-red-600">Erreur de chargement</p>

  const objects: TagObject[] = data.triples.map((t: any) => t.object)

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold mb-4">Tags List</h1>
      {objects.map((obj) => (
      <Link
        key={obj.id}
        to={`/tags/${obj.id}`}
        className="block no-underline"
      >
        <div
          key={obj.id}
          className="flex justify-between items-center p-3 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-3 claims-hover-effect"
        >

          <div className="flex items-center gap-4">
            {obj.image ? (
              <ImageWithFallback
                src={obj.image}
                alt={obj.label || ""}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Fingerprint className="w-10 h-10" />
              </div>
            )}

            <div>
              <h3 className="text-white font-semibold text-base">
                {obj.label}
              </h3>
              <p className="text-gray-400 text-xs">
                {(() => {
                  const raw = 
                    obj.value?.thing?.description 
                    ?? obj.value?.person?.description 
                    ?? '';
                  return raw.length > 70 ? raw.slice(0, 70) + '…' : raw;
                })()}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <SubjectCount objectId={obj.id} />
          </div>
        </div>
      </Link>
      ))}
    </div>
  )
}

export default HashtagObjectsPage
