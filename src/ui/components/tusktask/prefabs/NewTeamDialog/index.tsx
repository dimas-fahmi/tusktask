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
import { Input } from "../Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shadcn/ui/select";
import { Button } from "../../../shadcn/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewTeam } from "@/src/lib/tusktask/mutators/createNewTeam";
import { TeamsGetResponse } from "@/app/api/teams/get";
import { useSession } from "next-auth/react";
import { TeamsPostRequest } from "@/app/api/teams/post";

const newTeamSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(["co-op", "private"]),
});

const NewTeamDialog = () => {
  // Pull states from team context
  const { newTeamDialogOpen, setNewTeamDialogOpen } = useTeamContext();

  // Pull session
  const { data: session } = useSession();

  // Initialize form
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<z.infer<typeof newTeamSchema>>({
    resolver: zodResolver(newTeamSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "co-op",
    },
  });

  // Pull query client
  const queryClient = useQueryClient();

  // Initialize Mutation
  const { mutate: create } = useMutation({
    mutationKey: ["teams", "new"],
    mutationFn: createNewTeam,
    onMutate: async (data) => {
      setNewTeamDialogOpen(false);

      // Cancel all queries to prevent race condition
      queryClient.cancelQueries();

      // Preserve old state
      const oldTeams = queryClient.getQueryData(["teams"]) as TeamsGetResponse;

      // Mutate cache
      console.log(oldTeams);
      queryClient.setQueryData(["teams"], () => {
        if (!oldTeams?.data) {
          return oldTeams;
        }

        const newMembership = {
          createdByOptimisticUpdate: true,
          userRole: "owner",
          team: {
            id: crypto.randomUUID(),
            name: data.name,
            ownerId: session!.user.id!,
            createdById: session!.user.id!,
            type: data.type,
            createdAt: new Date(),
            createdByOptimisticUpdate: true,
          },
        };

        const newTeams = {
          ...oldTeams,
          data: [...oldTeams.data, newMembership],
        };

        console.log(newTeams);

        return newTeams;
      });

      return { oldTeams };
    },
    onError: (_, __, context) => {
      setNewTeamDialogOpen(true);

      if (context?.oldTeams) {
        queryClient.setQueryData(["teams"], context.oldTeams);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });

  return (
    <Dialog open={newTeamDialogOpen} onOpenChange={setNewTeamDialogOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle>New Team Dialog</DialogTitle>
        <DialogDescription>New Team Dialog</DialogDescription>
      </DialogHeader>
      <DialogContent className="p-4">
        <form
          onSubmit={handleSubmit((data) => {
            const request: TeamsPostRequest = data;
            create(request);
          })}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm mb-2">
              Team Name
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    variant={fieldState.error ? "error" : "default"}
                    size={"sm"}
                    className="capitalize"
                    placeholder="Kelompok 5 Fisika"
                  />
                  {fieldState.error && (
                    <p className="text-xs mt-1 text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm mb-2">
              Team Type
            </label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border border-border">
                    <SelectValue placeholder="Team Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="co-op">Co-Operation</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setNewTeamDialogOpen(false)}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamDialog;
