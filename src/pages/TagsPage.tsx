import { useGetListsTagsQuery } from "@warzieram/graphql"
import { Fingerprint, Tag } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ImageWithFallback } from "../components/ui/ImageWithFallback"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"

const HASHTAG_PREDICATE_ID = "0x49487b1d5bf2734d497d6d9cfcd72cdfbaefb4d4f03ddc310398b24639173c9d"
const PAGE_SIZE = 18

const HashtagObjectsPage: React.FC = () => {
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)

  const { data, loading, error } = useGetListsTagsQuery({
    variables: {
      where: {
        _and: [
          { as_object_triples: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } } }
        ]
      },
      triplesWhere: { predicate_id: { _eq: HASHTAG_PREDICATE_ID } },
      limit: PAGE_SIZE,
      offset,
      orderBy: [{ as_object_triples_aggregate: { count: "desc" } }]
    }
  })

  useEffect(() => {
    if (data?.atoms) {
      setItems((prev) =>
        offset === 0 ? data.atoms : [...prev, ...data.atoms]
      )
      setHasMore(data.atoms.length === PAGE_SIZE)
    }
  }, [data, offset])

  useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setOffset((prev) => prev + PAGE_SIZE)
  })

  if (error) return <p className="text-red-600">Error: {String(error)}</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Tags list</h1>
      {items.map((atom) => {
        const count = atom.as_object_triples_aggregate.aggregate.count
        return (
          <Link
            key={atom.term_id}
            to={`/tags/${atom.term_id}`}
            className="flex justify-between gap-3 items-center p-3 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-2 claims-hover-effect">
            <div className="flex items-center gap-3">
              {atom.image ? (
                <ImageWithFallback
                  src={atom.image}
                  alt={atom.label || ""}
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
                  {(atom.value?.thing?.description ?? "").slice(0, 70)}…
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-400 items-center">
              {count}
              <Tag className="w-3 h-3" />
            </span>
          </Link>
        )
      })}

      {loading && hasMore && (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      )}
      {!hasMore && (
        <p className="text-center text-sm text-gray-500">No more tags.</p>
      )}
    </div>
  )
}

export default HashtagObjectsPage
