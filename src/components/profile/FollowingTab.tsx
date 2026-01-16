import React from "react"
import { useGetTriplesWithPositionsQuery } from "@warzieram/graphql"
import { useWalletAddress } from "~src/hooks/useWalletAddress";
import { useAtomIds } from "~src/hooks/useAtomIds";
import defaultImg from "~src/assets/User.jpg

const FollowingTab: React.FC = () => {
  const walletAddress = useWalletAddress();
  const atomIds = useAtomIds();

  // Récupérer les triples ("I" follows <object>) où l'utilisateur a une position
  const { data, loading, error } = useGetTriplesWithPositionsQuery({
    variables: {
      where: {
        _and: [
          { subject_id: { _eq: atomIds.I_SUBJECT } },
          { predicate_id: { _eq: atomIds.FOLLOWS_PREDICATE } }
        ]
      },
      address: walletAddress || ""
    },
    skip: !walletAddress
  });

  console.log("Followings raw data:", data)
  console.log("Wallet address:", walletAddress)
  
  // Log détaillé de la structure complète
  if (data?.triples) {
    console.log("First triple full structure:", JSON.stringify(data.triples[0], null, 2))
  }

  if (!walletAddress) {
    return <p>Connect your wallet</p>
  }
  if (loading) {
    return <p>Loading who you follow…</p>
  }
  if (error) {
    return <p>Error loading followings: {error.message}</p>
  }

  // Si pas de triples, afficher un message
  if (!data?.triples || data.triples.length === 0) {
    return <p>No following data found.</p>
  }

  // Pour l'instant, afficher TOUS les objets sans filtrer par position
  // Car les positions semblent vides dans la réponse
  const followings = data.triples
    .map((triple) => {
      console.log("Processing triple:", {
        term_id: triple.term_id,
        object_label: triple.object?.label,
        term: triple.term,
        term_positions_aggregate: triple.term?.positions_aggregate,
        counter_positions: triple.counter_term?.positions_aggregate
      });
      return triple.object;
    })
    .filter((obj): obj is NonNullable<typeof obj> => obj != null);

  console.log("All followings (no filter):", followings);

  if (followings.length === 0) {
    return <p>You're not following anyone yet.</p>
  }


  return (
    <ul className="space-y-2">
      {followings.map((f) => (
        <li key={f.term_id} className="flex items-center gap-3 p-3 border rounded">
          <img
            src={f.image || defaultImg}
            alt={f.label || f.term_id}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-sm">
            {f.label || f.term_id}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default FollowingTab
