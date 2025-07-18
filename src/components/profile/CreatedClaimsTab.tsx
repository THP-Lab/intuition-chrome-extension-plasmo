import React from "react";
import { useStorage } from "@plasmohq/storage/hook";
import ClaimRowLite from "../ui/ClaimRowLite"
import { useGetTriplesByCreatorQuery } from "@warzieram/graphql";

const CreatedClaimsTab = () => {
  const [walletAddress] = useStorage<string>("metamask-account", "")

  const { data,loading, error } = useGetTriplesByCreatorQuery(
    {variables: { address: walletAddress }},
  )

  if (!walletAddress) return <div>No connected wallet</div>
  if (loading) return <div>Loading your claims...</div>
  if (error) return <div>Error: {(error as any)?.message}</div>
  if (!data?.triples?.length) return <div>No claims created yet.</div>

  return (
    <div>
      <p className="text-xs text-gray-400 font-medium mt-2 mb-1 flex justify-start items-center gap-2">
        Claims
        <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {data.triples.length}
        </span>
      </p>
      {data.triples.map((triple, index) => {

        return (
        <ClaimRowLite
          key={`${triple.term_id}-${index}`}
          claim={triple}
        />     
        )
      })}
    </div>
  )
}

  export default CreatedClaimsTab;

