import React, { useState } from "react";
import {
  useGetAccountByIdQuery,
  useGetClaimsByAddressQuery,
  useGetPersonsByIdentifierQuery
} from "~src/graphql/src";

import WalletConnectionButton from "~src/components/WalletConnectionButton";
import ProfileTabs from "~src/components/profile/ProfileTabs";
import { Outlet } from "react-router-dom";
import { useStorage } from "@plasmohq/storage/hook";
import { useNavigation } from "~src/components/layout/NavigationProvider"
import AccountSection from "~src/components/profile/AccountSection";
import AtomProfileSection from "~src/components/profile/AtomProfileSection";
import IntuitionNavSwitch from "~src/components/layout/IntuitionNavSwitch";

import { Button } from "~src/components/ui/button";
import { cn } from "~src/lib/utils";

const ProfileLayout = () => {
  const [position, setPosition] = useState({ x: 0, y: -3 });
  const [address] = useStorage<string>("metamask-account");
  const [editMode, setEditMode] = useState(false);

  const { data: personData } = useGetPersonsByIdentifierQuery(
    { identifier: address || "" },
    { enabled: !!address }
  );
  const person = personData?.persons?.[0];

  const { data: accountData } = useGetAccountByIdQuery({ id: address || "" });
  const { data: claimsData } = useGetClaimsByAddressQuery({ address: address || "" });

  const account = accountData?.account;

  const { navType, setNavType } = useNavigation()

  const toggleNavType = () => {
    console.log("ProfileLayout toggleNavType appelé");
    setNavType(navType === "classic" ? "arc" : "classic");
  };

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
          <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center justify-center p-1 nav-switch-button",
          "bg-transparent",
          "hover:bg-accent/10 hover:text-accent-foreground",
          "transition-colors"
        )}
        title={`Switch to ${navType === "classic" ? "Arc" : "Classic"} Nav`}
        onClick={toggleNavType}
      >
        <div className="text-foreground">
          <IntuitionNavSwitch size={18} className="mb-1" />
        </div>
      </Button>
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

      {person && <AtomProfileSection person={person} />}

      <ProfileTabs />
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
