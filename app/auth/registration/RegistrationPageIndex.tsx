"use client";

import { useSession, useSignOut } from "@/src/lib/hooks/auth/useAuth";
import AuthAlert from "@/src/ui/components/Prefabs/AuthAlert";
import React, { Suspense } from "react";

const RegistrationPageIndex = () => {
  // Get Session
  const { data: session } = useSession();

  // SignOut
  const { mutate: signOut } = useSignOut();

  return (
    <div>
      {/* Header */}
      <header className="mt-4">
        <h1 className="font-header font-bold text-2xl mb-2">
          Email Confirmation
        </h1>
        <p className="text-sm">
          {`This action is intended to prevent you from being locked out of your account.`}
        </p>
      </header>

      {/* Auth Alert */}
      <Suspense>
        <AuthAlert className="mt-6" />
      </Suspense>

      <form className="mt-6 space-y-4">
        {/* Email */}
        {/* <Input
          name="email"
          aria-placeholder="Email"
          placeholder="Email"
        /> */}
      </form>

      {/* Helper Bar */}
      <div className="mt-4 text-sm font-light flex items-center justify-between">
        <span>{`It's not your account?`}</span>
        <button
          className="navlink"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default RegistrationPageIndex;
