import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import { Button } from "../../../shadcn/ui/button";
import { CircleAlert, LoaderCircle, Minimize } from "lucide-react";
import { ScrollArea } from "../../../shadcn/ui/scroll-area";
import { Input } from "../Input";
import UserCard from "../UserCard";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import fetchUsers from "@/src/lib/tusktask/fetchers/fetchUsers";

const InviteMemberDialog = () => {
  // Pull states from team context
  const { inviteMemberDialog, setInviteMemberDialog, teamDetailKey } =
    useTeamContext();

  // Search states
  const [searchKey, setSearchkey] = useState<string | null>(null);

  // Form initialization
  const {
    control,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      search: "",
    },
  });

  // Listen to search changes
  const search = watch("search");

  // Debouncer
  useEffect(() => {
    const debouncer = setTimeout(() => {
      setSearchkey(search);
    }, 600);

    return () => clearTimeout(debouncer);
  }, [search]);

  // Fetching
  const { data, isFetching } = useQuery({
    queryKey: ["users", searchKey],
    queryFn: () => fetchUsers({ search: searchKey! }),
    enabled: !!searchKey,
  });

  const users = data && data?.data ? data.data : [];

  useEffect(() => {
    console.log(data);
  }, [data]);

  // Reset search key when dialog is closed
  useEffect(() => {
    if (!inviteMemberDialog) {
      setSearchkey(null);
    }
  }, [inviteMemberDialog]);

  return (
    <Dialog open={inviteMemberDialog} onOpenChange={setInviteMemberDialog}>
      <DialogHeader>
        <DialogTitle className="sr-only">Invite Member Dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Invite new user to this team
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="p-0 border-0 flex flex-col gap-0 overflow-hidden">
        {/* Header */}
        <header className="p-4 space-y-3 bg-primary text-primary-foreground border-0">
          {/* Top section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Memberships</h1>
              <p className="text-xs opacity-60 font-semibold">
                Search your friends by their name or username
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant={"ghost"}
                className="text-primary-foreground"
                onClick={() => setInviteMemberDialog(false)}
              >
                <Minimize />
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="grid grid-cols-1">
            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <Input
                  type="search"
                  {...field}
                  placeholder="Asep Suhendar"
                  size={"sm"}
                  autoComplete="off"
                />
              )}
            />
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="h-[320px]">
          {!isFetching &&
            users.map((user, index) => <UserCard user={user} key={index} />)}

          {isFetching && (
            <span className="p-4 flex items-center justify-center animate-pulse text-sm gap-1">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Looking for your friend...
            </span>
          )}

          {!isFetching && users.length === 0 && searchKey && (
            <span className="p-4 flex items-center justify-center text-sm gap-1">
              <CircleAlert className="w-3 h-3" />
              Can't find your friend
            </span>
          )}

          {!isFetching && users.length === 0 && !searchKey && (
            <span className="p-4 flex items-center justify-center text-sm gap-1">
              <CircleAlert className="w-3 h-3" />
              Start typing to find your friend
            </span>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
