import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetTaggedObjectsQuery } from '~src/graphql/src'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { Fingerprint } from "lucide-react"


const HASHTAG_PREDICATE_ID = 4;

const SubjectTag: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>()

  const { data, isLoading, error } = useGetTaggedObjectsQuery({
      objectId: Number(tagId),
      predicateId: HASHTAG_PREDICATE_ID,
  })

  if (isLoading) return <p>Chargement…</p>
  if (error) return <p className="text-red-600">Erreur de chargement</p>

  const subjects = data?.triples.map(t => t.subject) ?? []

  return (
    <div className="mt-2 space-y-6">
      <section>
        <h2 className="text-lg font-semibold">
          List atom with this tag
        </h2>
        <div className="space-y-4 mt-4">
          {subjects.map(subject => (
            <div
              key={subject.id}
              className="flex justify-between items-center p-1 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-3 claims-hover-effect"
            >

              <div className="flex items-center gap-4">
                {subject.image ? (
                  <ImageWithFallback
                    src={subject.image}
                    alt={subject.label || ""}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {subject.label}
                  </h3>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SubjectTag;