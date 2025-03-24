import React, { useEffect, useState } from "react";
import { useGetClaimsByAddressQuery } from "~src/graphql/src";
import { Claim } from "@0xintuition/1ui";
import WalletConnectionButton from "~src/components/WalletConnectionButton";

function Profile() {
  const [address, setAdress] = useState(localStorage.getItem("metamask-account")) ;

  if(!address) {
    return(
      <div>
        Please link your metamask account then re-open this page
        <WalletConnectionButton />
      </div>
    )
  }


  const { data, isLoading } = useGetClaimsByAddressQuery({
    address: address,
  });

  if (isLoading) return <div>Loading...</div>;

  console.log(data.claims_aggregate.nodes);


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


export default Profile;
