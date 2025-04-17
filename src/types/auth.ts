import { DefaultSession } from "next-auth";
import { UserType } from "../db/schema/users";

declare module "next-auth" {
  interface Session {
    user: {
      registration: UserType["registration"];
      email: UserType["email"];
      userName: UserType["userName"];
      firstName: UserType["firstName"];
      lastName: UserType["lastName"];
      notificationSound: UserType["notificationSound"];
      reminderSound: UserType["reminderSound"];
    } & DefaultSession["user"];
  }
}
