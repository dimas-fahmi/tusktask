import { Metadata } from "next";
import React from "react";
import { RegistrationFlowIndex } from "./flow";

export const metadata: Metadata = {
  title: "Registration | TuskTask",
};

const RegistrationPage = () => {
  return <RegistrationFlowIndex />;
};

export default RegistrationPage;
