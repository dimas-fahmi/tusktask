import type { Metadata } from "next";
import SettingsPageIndex from "./SettingsPageIndex";

export const metadata: Metadata = {
  title: "Settings | TuskTask",
};

const SettingsPage = async () => {
  return <SettingsPageIndex />;
};

export default SettingsPage;
