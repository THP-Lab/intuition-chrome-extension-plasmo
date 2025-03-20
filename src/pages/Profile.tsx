import { useState } from "react";
import { Button } from "@0xintuition/1ui"; 


function Profile() {
  return (
    <div className="flex flex-col h-screen p-4">
    <h1 className="text-2xl font-bold">Profile Page</h1>
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <Button size="md" variant="accent">Connect to Wallet</Button>
      </div>
  </div>
);
};


export default Profile;