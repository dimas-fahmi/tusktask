import { DefaultSession } from "next-auth";
import { UserType } from "../db/schema/users";

declare module "next-auth" {
  interface Session {
    user: {
      registration: UserType["registration"];
      email: UserType["email"];
      username: UserType["username"];
      notificationSound: UserType["notificationSoundEnable"];
      reminderSound: UserType["reminderSoundEnable"];
    } & DefaultSession["user"];
  }
}
