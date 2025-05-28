import React from "react";
import Google from "../../svg/logos/Google";
import Discord from "../../svg/logos/Discord";
import GitHub from "../../svg/logos/Github";
import { Button } from "../../../shadcn/ui/button";
import { signIn } from "next-auth/react";

const OAuthButton = ({
  provider,
}: {
  provider: "google" | "discord" | "github";
}) => {
  const logos = {
    google: Google,
    discord: Discord,
    github: GitHub,
  };

  const Logo = logos[provider];
  return (
    <Button variant={"oAuth"} onClick={() => signIn(provider)}>
      <Logo />
      {provider}
    </Button>
  );
};

export default OAuthButton;
