import React from "react";
import { useGetClaimsByAddressQuery } from "~src/graphql/src";
import { Claim } from "@0xintuition/1ui";

interface YourClaimsTabProps {
  account: string
}

const YourClaimsTab: React.FC<YourClaimsTabProps> = ({ account }) => {
  
  //Fetch claims created by the connected user using the account address
  const { data, isLoading } = useGetClaimsByAddressQuery({address: account
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <>

    <div>
      <h2>Your Claims ( {data.claims_aggregate.aggregate.count} )</h2>
      {!isLoading && data.claims_aggregate.nodes.map(({ triple, shares, counter_shares }) => (
        <div key={triple.id} style={{ padding: "10px", backgroundColor: 'black', color: 'white' }}>
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

export default YourClaimsTab;