import React from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { useGetTriplesByCreatorQuery } from "@warzieram/graphql"
import ClaimRowLite from "../ui/ClaimRowLite"

const YourClaimsTab = () => {
  const [account] = useStorage<string>("metamask-account")  

  const { data, isLoading, isError, error } = useGetTriplesByCreatorQuery(
    { address: account ?? "" },
    { enabled: !!account }
  )

  if (!account) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading your claims...</div>
  if (isError) return <div>Error: {(error as any)?.message}</div>
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
          key={`${triple.id}-${index}`}
          claim={triple}
        />     
        )
      })}
    </div>
  )
}

  export default YourClaimsTab;

