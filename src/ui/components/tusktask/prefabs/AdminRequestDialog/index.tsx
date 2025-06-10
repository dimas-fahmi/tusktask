"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { getUserInitials } from "@/src/lib/tusktask/utils/getUserInitials";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import { Input } from "../Input";
import { Button } from "../../../shadcn/ui/button";
import { Badge } from "../../../shadcn/ui/badge";
import { Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { NotificationsPostRequest } from "@/app/api/notifications/post";

const messageSchema = z.object({
  title: z
    .string()
    .max(100)
    .transform((val) =>
      val
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    ),
  description: z.string().max(255),
});

const AdminRequestDialog = () => {
  // Pull session
  const { data: session } = useSession();

  // Pull states from team context
  const { adminRequestDialog, handleResetAdminRequestDialog } =
    useTeamContext();

  const { open, membership } = adminRequestDialog;
  const user = membership?.user;

  // Initialize Forms
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  //  Pull notification context values
  const { createNotification } = useNotificationContext();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleResetAdminRequestDialog();
          return;
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail /> Request Administration
          </DialogTitle>
          <DialogDescription>
            Request administration rights to {user?.name}?
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            if (!user || !session?.user?.id || !membership?.teamId) {
              console.log("anjing");
              return;
            }

            const req: NotificationsPostRequest = {
              title: data?.title.length > 0 ? data.title : null,
              description:
                data?.description.length > 0 ? data.description : null,
              receiverId: user.id,
              type: "adminRequest",
              senderId: session.user.id,
              teamId: membership.teamId,
            };
            createNotification(req);

            handleResetAdminRequestDialog();
          })}
        >
          <div className="p-4 border rounded-md">
            {/* Target user card */}
            <div className="flex gap-2 items-center mb-2">
              {/* Avatar */}
              <div>
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src={user?.image ?? DEFAULT_AVATAR}
                    alt={`${user?.name}'s Avatar`}
                  />
                  <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex justify-between items-center w-full">
                <div>
                  <h1 className="font-bold leading-4 flex items-center gap-2">
                    <span>{truncateText(user?.name ?? "", 3)}</span>
                    <span className="text-xs font-normal">
                      {membership?.userRole}
                    </span>
                  </h1>
                  <p className="text-sm">{user?.username}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            {/* Subject */}
            <div>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      variant={"ghost"}
                      placeholder="Subject (optional)"
                      className="rounded-none w-full mb-1 capitalize text-xl p-0 mt-2"
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      rows={6}
                      className="pt-0 border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-16 max-h-48"
                      placeholder="Messages (optional)"
                    />
                  </>
                )}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => {
                handleResetAdminRequestDialog();
              }}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button>Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRequestDialog;
