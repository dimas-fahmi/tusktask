import React from "react";
import SignInPageIndex from "./SignInPageIndex";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Continue To TuskTask",
};

const SignInPage = () => {
  return <SignInPageIndex />;
};

export default SignInPage;
