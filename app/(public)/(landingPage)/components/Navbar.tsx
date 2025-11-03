"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const Navbar = () => {
  return (
    <>
      {/* Main */}
      <nav className="relative py-2 px-4 md:px-6 lg:px-16 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Image
            width={180}
            height={50}
            src={
              "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/TuskTask-Horizontal.png"
            }
            alt="TuskTask Logo"
          />
        </div>

        {/* Navigation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-muted flex items-center justify-center px-4 py-2 rounded-full gap-3">
            <Link href={"#reminder"} className="font-header opacity-50">
              Reminder
            </Link>
            <Link href={"#features"} className="font-header opacity-50">
              Features
            </Link>
            <Link href={"#testimonies"} className="font-header opacity-50">
              Testimonies
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div>
          <Button>Sign In</Button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
