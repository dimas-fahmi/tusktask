import type { Metadata } from "next";
import AccountDeletedPageIndex from "./AccountDeletedPageIndex";

export const metadata: Metadata = {
  title: "Account Deletion Scheduled | TuskTask",
};

const DeletedPage = () => {
  return <AccountDeletedPageIndex />;
};

export default DeletedPage;
