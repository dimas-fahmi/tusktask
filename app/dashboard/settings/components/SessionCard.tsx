import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CircleQuestionMark,
  EthernetPort,
  Gamepad2,
  type LucideIcon,
  Monitor,
  RectangleGoggles,
  Smartphone,
  Tablet,
  Tv,
  Watch,
} from "lucide-react";
import { useState } from "react";
import { UAParser } from "ua-parser-js";
import type { DeviceType } from "ua-parser-js/enums";
import type { ActiveSession } from "@/src/lib/app/app";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { useNotificationStore } from "@/src/lib/stores/notification";
import TwoChoiceDialog from "@/src/ui/components/ui/TwoChoiceDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const deviceTypeIcon: Record<
  (typeof DeviceType)[keyof typeof DeviceType] | "unknown",
  LucideIcon
> = {
  console: Gamepad2,
  desktop: Monitor,
  embedded: EthernetPort,
  mobile: Smartphone,
  smarttv: Tv,
  tablet: Tablet,
  wearable: Watch,
  xr: RectangleGoggles,
  unknown: CircleQuestionMark,
};

export const SessionCard = ({
  session,
  isCurrent,
}: {
  session: ActiveSession;
  isCurrent?: boolean;
}) => {
  const { triggerToast } = useNotificationStore();
  const { browser, device, os } = UAParser(session?.userAgent ?? "");
  console.log(device);
  const Icon = deviceTypeIcon[device.type ?? "unknown"];
  const ipLookupQuery = queryIndex.ipLocate.lookup(
    session?.ipAddress ?? "undefined",
  );

  const { data: ipLookupResponse } = useQuery({
    ...ipLookupQuery.queryOptions,
  });

  const city = ipLookupResponse?.result?.city || "[no-city-record]";
  const subdivision =
    ipLookupResponse?.result?.subdivision || "[no-subdivision-record]";
  const country = ipLookupResponse?.result?.country || "[no-country-record]";
  const isCompleteBlind =
    !ipLookupResponse?.result?.city &&
    !ipLookupResponse?.result?.subdivision &&
    !ipLookupResponse?.result?.country;

  const [revokeSessionDialog, setRevokeSessionDialog] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const sessionQuery = queryIndex.self.sessions();
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between">
      {/* Metadata */}
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div>
          <Icon />
        </div>

        {/* Information */}
        <div>
          <h1 className="font-semibold">
            {isCompleteBlind ? (
              "No Information About This IP Address"
            ) : (
              <>
                {city}, {subdivision}, {country}
              </>
            )}
          </h1>
          <p className="text-xs font-light">
            {session?.ipAddress ?? "[no-ip-record]"},{" "}
            {browser?.name ?? "[no-browser-data]"},{" "}
            {os?.name ?? "[no-os-detail]"}
          </p>
        </div>
      </div>

      {/* Action */}
      <div>
        <Button
          variant={isCurrent ? "outline" : "destructive"}
          size={"sm"}
          className="text-xs"
          disabled={isCurrent || isRevoking}
          onClick={() => {
            if (isCurrent) return;
            setRevokeSessionDialog(true);
          }}
        >
          {isCurrent ? "Current" : "Terminate"}
        </Button>

        <TwoChoiceDialog
          title="Terminate Session"
          description={`Are you sure you want to terminate this session?`}
          positiveText={"Revoke"}
          negativeText={"Cancel"}
          open={revokeSessionDialog}
          setOpen={setRevokeSessionDialog}
          positiveProps={{
            onClick: async () => {
              if (isCurrent || isRevoking) return;
              setIsRevoking(true);
              await authClient.revokeSession(
                {
                  token: session.token,
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: sessionQuery.queryKey,
                    });

                    triggerToast(
                      "Session Terminated",
                      {
                        description:
                          "Session terminated successfully, your account is logged out from that session.",
                      },
                      "success",
                    );
                  },
                  onError: () => {
                    triggerToast(
                      "Something Went Wrong",
                      {
                        description:
                          "Failed to terminate session, try again if the issue persist please contact developer.",
                      },
                      "error",
                    );
                  },
                },
              );
              setIsRevoking(false);
              setRevokeSessionDialog(false);
            },
            disabled: isRevoking || isCurrent,
          }}
        />
      </div>
    </div>
  );
};
