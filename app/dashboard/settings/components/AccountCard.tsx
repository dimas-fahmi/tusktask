import { useQueryClient } from "@tanstack/react-query";
import type { Account } from "better-auth";
import { DateTime } from "luxon";
import { useState } from "react";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { capitalizeWord } from "@/src/lib/utils/formatText";

import TwoChoiceDialog from "@/src/ui/components/ui/TwoChoiceDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";

export const AccountCard = ({
  name,
  icon: Icon,
  isConnected,
  disabled,
  account,
  isNotSupported,
  isLastAccount,
}: {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isConnected?: boolean;
  disabled?: boolean;
  isNotSupported?: boolean;
  account?: Account;
  isLastAccount?: boolean;
}) => {
  const accountQuery = queryIndex.self.accounts();
  const [disconnectDialog, setDisconnectDialog] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const { triggerToast } = useNotificationStore();
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between">
      {/* Metadata */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div>
          <Icon className="w-6 h-6 opacity-70 fill-current" />
        </div>

        {/* Name & Status */}
        <div>
          <h1 className="capitalize">{name}</h1>
          <p className="text-xs font-light">
            {account
              ? `Connected ${DateTime.fromJSDate(account.createdAt).toRelative()}`
              : "Not connected"}
          </p>
        </div>
      </div>

      {/* Action */}
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                size={"sm"}
                variant={isConnected ? "destructive" : "outline"}
                className="text-xs"
                disabled={disconnectLoading || disabled}
                onClick={async () => {
                  if (isConnected) {
                    setDisconnectDialog(true);
                    return;
                  } else {
                    await authClient.linkSocial({
                      provider: name,
                      callbackURL: encodeURI(
                        `/dashboard/settings?scrollTo=accounts-section`,
                      ),
                    });
                  }
                }}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </TooltipTrigger>
          {isNotSupported && <TooltipContent>Not yet supported</TooltipContent>}
          {isLastAccount && (
            <TooltipContent>{`Can't remove your last account`}</TooltipContent>
          )}
        </Tooltip>

        <TwoChoiceDialog
          open={disconnectDialog}
          setOpen={setDisconnectDialog}
          title={`Disconnect Social`}
          description={`Are you sure, you want to remove ${capitalizeWord(name)}?`}
          positiveText={"Remove"}
          negativeText={"Cancel"}
          positiveProps={{
            onClick: async () => {
              setDisconnectLoading(true);
              await authClient.unlinkAccount(
                {
                  providerId: name,
                },
                {
                  onSuccess: () => {
                    triggerToast(
                      `Social Account Removed`,
                      {
                        description: `${capitalizeWord(name)} successfully removed from your account`,
                      },
                      "success",
                    );
                  },
                  onError: () => {
                    triggerToast(
                      `Something Went Wrong`,
                      {
                        description: `Failed to remove ${capitalizeWord(name)} from your account`,
                      },
                      "error",
                    );
                  },
                },
              );
              queryClient.invalidateQueries({
                queryKey: accountQuery.queryKey,
              });
              setDisconnectLoading(false);
              setDisconnectDialog(false);
            },
          }}
        />
      </div>
    </div>
  );
};
