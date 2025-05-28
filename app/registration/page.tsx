import { Metadata } from "next";
import React from "react";
import RegistrationIndex from "./RegistrationIndex";

export const metadata: Metadata = {
  title: "Welcome To TuskTask | Registration",
};

const RegistrationPage = () => {
  return <RegistrationIndex />;
};

export default RegistrationPage;
