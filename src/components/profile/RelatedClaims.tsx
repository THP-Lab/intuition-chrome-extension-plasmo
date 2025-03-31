import React, { useEffect, useState } from "react"
import { useGetClaimsByAddressQuery } from "~src/graphql/src";
import { Claim } from "@0xintuition/1ui";
import { useStorage } from "@plasmohq/storage/hook";

const RelatedClaims = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, isLoading, isError, error } = useGetClaimsByAddressQuery(
    { address: account ?? "" }, 
    { enabled: !!account }      
  )

  if (!account) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {(error as any)?.message}</div>
  if (!data?.claims_aggregate?.nodes?.length) return <div>No claims found</div>

  return (
    <>

    <div>
      <h2>Related Claims ( {data.claims_aggregate.aggregate.count} )</h2>
      {!isLoading && data.claims_aggregate.nodes.map(({ triple, shares, counter_shares }) => (
        <div key={triple.id} style={{ padding: "5px" }}>
          <Claim
            orientation="horizontal"
            subject={{
              variant: triple.subject.type === "Account" ? "user" : "non-user",
              label: triple.subject?.label || "N/A",
              imgSrc: triple.subject?.image || "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
            }}
            predicate={{
              variant: triple.predicate.type === "Account" ? "user" : "non-user",
              label: triple.predicate?.label || "N/A",
              imgSrc: triple.predicate?.image || "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
            }}
            object={{
              variant: triple.object.type === "Account" ? "user" : "non-user",
              label: triple.object?.label || "N/A",
              imgSrc: triple.object?.image || "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png",
            }}
          />
        </div>
      ))}
    </div>
  </>
  );
};

export default RelatedClaims;