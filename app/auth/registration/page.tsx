import { VERCEL_BLOB_HOST } from "@/src/lib/configs";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import NavLink from "@/src/ui/components/NavLink";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RegistrationPageIndex from "./RegistrationPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Registration Phase",
});

const RegistrationPage = () => {
  return (
    <div className="max-w-md p-4">
      {/* Logo */}
      <Link href={"/"}>
        <Image
          width={250}
          height={250}
          src={`${VERCEL_BLOB_HOST}/logo/tusktask.png`}
          alt="TuskTask Logo Symbolic"
          className="w-16 h-16 block"
        />
      </Link>

      {/* Registration */}
      <RegistrationPageIndex />

      {/* Policy */}
      <footer className="mt-6 text-xs">
        By this you agree to our{" "}
        <NavLink href="/policy">privacy policy</NavLink>
      </footer>
    </div>
  );
};

export default RegistrationPage;
