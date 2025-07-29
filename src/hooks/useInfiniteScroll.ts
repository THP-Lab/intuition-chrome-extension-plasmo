import { useEffect } from "react"

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 100
}: {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  threshold?: number
}) {
  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore) return
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold
      ) {
        onLoadMore()
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [loading, hasMore, onLoadMore, threshold])
}