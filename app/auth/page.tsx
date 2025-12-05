import type { Metadata } from "next";
import AuthPageIndex from "./AuthPageIndex";

export const metadata: Metadata = {
  title: "Continue to TuskTask",
};

const AuthPage = () => {
  return <AuthPageIndex />;
};

export default AuthPage;
