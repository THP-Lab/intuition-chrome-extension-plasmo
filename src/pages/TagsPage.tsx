import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGetListsTagsQuery } from '@warzieram/graphql'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { Fingerprint } from 'lucide-react'
import { Tag } from 'lucide-react';

const HASHTAG_PREDICATE_ID = 4
const PAGE_SIZE = 18

const HashtagObjectsPage: React.FC = () => {
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<typeof data['atoms']>([])
  const [hasMore, setHasMore] = useState(true)

  const { data, isLoading, isFetching, isError, error } = useGetListsTagsQuery(
    {
      where: {
        _and: [
          { as_object_triples: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } } }
        ]
      },
      triplesWhere: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } },
      limit: PAGE_SIZE,
      offset,
      orderBy: [{ as_object_triples_aggregate: { count: 'desc' } }]
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  )

  // accumulate pages
  useEffect(() => {
    if (!data) return
    if (offset === 0) {
      setItems(data.atoms)
    } else {
      setItems(prev => [...prev, ...data.atoms])
    }
    setHasMore(data.atoms.length === PAGE_SIZE)
  }, [data, offset])

  useEffect(() => {
    const onScroll = () => {
      if (isLoading || isFetching || !hasMore) return
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setOffset(prev => prev + PAGE_SIZE)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLoading, isFetching, hasMore])

  if (isError) return <p className="text-red-600">Error: {String(error)}</p>
  if (offset === 0 && isLoading) return <p>Loading…</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Tags list</h1>

      {items.map(atom => {
        const count = atom.as_object_triples_aggregate.aggregate.count
        return (
          <Link
            key={atom.id}
            to={`/tags/${atom.id}`}
            className="flex justify-between gap-3 items-center p-3 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-2 claims-hover-effect"
          >
            <div className="flex items-center gap-3">
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
                <h3 className="text-white font-semibold">{atom.label}</h3>
                <p className="text-gray-400 text-xs mt-1">
                  {(atom.value?.thing?.description ?? '').slice(0, 70)}…
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-400 items-center">{count}<Tag className='w-3 h-3'/></span>
          </Link>
        )
      })}

      {isFetching && hasMore && (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      )}
      {!hasMore && (
        <p className="text-center text-sm text-gray-500">No more tags.</p>
      )}
    </div>
  )
}

export default HashtagObjectsPage
