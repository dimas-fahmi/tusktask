"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import { Input } from "../Input";
import { Search } from "lucide-react";
import { Button } from "../../../shadcn/ui/button";
import UserCard from "./UserCard";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import fetchUsers from "@/src/lib/tusktask/fetchers/fetchUsers";
import { useSession } from "next-auth/react";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";

const NewRoomChatDialog = () => {
  // Pull session
  const { data: session } = useSession();

  // Pull state from chat context
  const { newRoomChatDialogOpen, setNewRoomChatDialogOpen } = useChatStore(
    useShallow((s) => ({
      newRoomChatDialogOpen: s.newRoomChatDialogOpen,
      setNewRoomChatDialogOpen: s.setNewRoomChatDialogOpen,
    }))
  );

  // Fetch User
  const [userKey, setUserKey] = useState<string | undefined>(undefined);

  // Form
  const { control, watch } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const query = watch("query");

  // Debouncer
  useEffect(() => {
    const debouncer = setTimeout(() => {
      if (query !== userKey) {
        setUserKey(query);
      }
    }, 700);

    return () => clearTimeout(debouncer);
  }, [query]);

  // Query Users
  const { data: usersResponse, isFetching } = useQuery({
    queryKey: ["users", userKey],
    queryFn: () => fetchUsers({ search: userKey! }),
    enabled: !!userKey,
  });

  const users = usersResponse?.data
    ? usersResponse.data.filter((t) => t.id !== session?.user?.id)
    : [];

  return (
    <Dialog
      open={newRoomChatDialogOpen}
      onOpenChange={setNewRoomChatDialogOpen}
    >
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold leading-4">
            Search Someone
          </DialogTitle>
          <DialogDescription className="text-sm">
            Search your friends by their name or username.
          </DialogDescription>

          {/* Form */}
          <div className="mt-4 flex items-center px-3 border-b">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Controller
              control={control}
              name="query"
              render={({ field }) => (
                <Input
                  {...field}
                  variant={"ghost"}
                  className="rounded-none text-sm flex-grow"
                  placeholder="Jenna Ortega"
                />
              )}
            />
          </div>
        </DialogHeader>

        {/* main */}
        <div className="min-h-[180px]">
          {isFetching && (
            <p className="text-sm text-muted-foreground text-center">
              Searching...
            </p>
          )}

          {!isFetching && !userKey && (
            <p className="text-sm text-muted-foreground text-center">
              Start typing to search
            </p>
          )}

          {!isFetching && userKey && users.length < 1 && (
            <p className="text-sm text-muted-foreground text-center">
              No users found
            </p>
          )}

          {!isFetching &&
            users.map((user) => <UserCard key={user.id} user={user} />)}
        </div>

        {/* footer */}
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => setNewRoomChatDialogOpen(false)}
          >
            Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoomChatDialog;
