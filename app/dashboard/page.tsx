"use client";

import { useEffect } from "react";
import { authClient } from "@/src/lib/auth/client";

const DashboardPage = () => {
  useEffect(() => {
    authClient.getSession().then((data) => {
      console.log(data);
    });
  }, []);

  return <div>DashboardPage</div>;
};

export default DashboardPage;
