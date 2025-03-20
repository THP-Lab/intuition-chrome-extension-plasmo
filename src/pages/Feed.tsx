import { useQueryClient } from '@tanstack/react-query';
import { useSearchAtomsByUriQuery } from '../queries';

function Feed() {

  const client = useQueryClient(); // Sets the client for gql queries

  const { data, isLoading } = useSearchAtomsByUriQuery("", "metamask.io")
  return (
    <p>
      Feed page
      {isLoading ? "En train de charger" : JSON.stringify(data)}
    </p>
  )

}

export default Feed;
