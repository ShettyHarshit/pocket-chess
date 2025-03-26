import { SignIn } from "@clerk/clerk-react";
import React from "react";

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <SignIn onlyThirdPartyProviders />
      </div>
    </div>
  );
}
