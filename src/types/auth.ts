import { DefaultSession } from "next-auth";
import { UserType } from "../db/schema/users";

declare module "next-auth" {
  interface Session {
    user: {
      registration: UserType["registration"];
    } & DefaultSession["user"];
  }
}
