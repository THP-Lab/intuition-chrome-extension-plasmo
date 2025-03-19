import { useGetTriplesQuery } from '@0xintuition/graphql'


function Feed() {
  const { data, isLoading } = useGetTriplesQuery( { limit: 100} )
  
  return (
    <p>
      Feed page
      { isLoading ? "En train de charger" : JSON.stringify(data.triples) }
    </p> 
  )

}

export default Feed;