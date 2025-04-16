import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-scroll">
      <div className="absolute top-5 right-5 hover:scale-105 transition-all duration-300 active:scale-95">
        <Link href={"/"}>
          <Image
            width={40}
            height={40}
            src={
              "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png"
            }
            alt="TuskTask Logo"
          />
        </Link>
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
