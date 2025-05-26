import React, { useState } from "react";
import {
  useGetAccountByIdQuery,
  useGetClaimsByAddressQuery,
  useGetPersonsByIdentifierQuery
} from "@warzieram/graphql";

import WalletConnectionButton from "~src/components/WalletConnectionButton";
import ProfileTabs from "~src/components/profile/ProfileTabs";
import { Outlet } from "react-router-dom";
import { useStorage } from "@plasmohq/storage/hook";
import AccountSection from "~src/components/profile/AccountSection";
import PreferenceSection from "~src/components/profile/PreferenceSection";
import AtomProfileSection from "~src/components/profile/AtomProfileSection";


const ProfileLayout = () => {
  const [position, setPosition] = useState({ x: 0, y: -3 });
  const [address] = useStorage<string>("metamask-account");
  const [editMode, setEditMode] = useState(false);

  const { data: personData } = useGetPersonsByIdentifierQuery(
    {variables: { identifier: address || "" }},
  );
  const person = personData?.persons?.[0];

  const { data: accountData } = useGetAccountByIdQuery({variables: { id: address || "" }});
  const { data: claimsData } = useGetClaimsByAddressQuery({variables: { address: address || "" }});

  const account = accountData?.account;


  if (!address) {
    return (
      <div className="flex flex-col items-center space-y-4 p-4">
        <p className="text-foreground">
          Please link your Metamask account, then re-open this page.
        </p>
        <WalletConnectionButton />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        </div>
        <WalletConnectionButton />
      </div>
      <p>{address}</p>

      <AccountSection
        account={account}
        person={person}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <PreferenceSection />

      {person && <AtomProfileSection person={person} />}

      <ProfileTabs />
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
