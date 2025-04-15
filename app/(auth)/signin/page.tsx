import { Metadata } from "next";
import React from "react";
import SignInPageIndex from "./components";

export const metadata: Metadata = {
  title: "Continue to the app | TuskTask",
};

const SignInPage = () => {
  return <SignInPageIndex />;
};

export default SignInPage;
