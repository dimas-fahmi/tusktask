"use client";

import { Button } from "@/src/ui/components/shadcn/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavLink = ({ title, href }: { title: string; href: string }) => {
  return (
    <Link
      href={href}
      className="h-full px-2 flex items-center justify-center text-tt-primary-foreground/90 font-primary underline-effect"
    >
      {title}
    </Link>
  );
};

const NavBar = () => {
  return (
    <nav className={`p-4 flex gap-4`}>
      {/* Brand */}
      <div>
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          <Image
            width={70}
            height={70}
            src="https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask-wordmark.png"
            alt="Logo"
            className="mr-2"
          />
        </Link>
      </div>
      {/* Navigation Links */}
      <div className="md:flex justify-between flex-grow border-l ps-2 hidden">
        {/* Start Section */}
        <div className="flex">
          <NavLink title="Guides" href="/guides" />
          <NavLink title="Lisence" href="/guides/lisence" />
          <NavLink title="Privacy & Policy" href="/guides/privacy-and-policy" />
          <NavLink
            title="Terms & Conditions"
            href="/guides/terms-and-conditions"
          />
        </div>

        {/* End Section */}
        <div className="flex items-center gap-3">
          <Button variant={"link"}>Github</Button>
          <Button asChild>
            <Link href={"/signin"}>Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
