import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, CircleQuestionMark, Trash } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { UAParser } from "ua-parser-js";
import type { ActiveSession } from "@/src/lib/app/app";
import { DEVICE_TYPE_ICON } from "@/src/lib/lucideIcons/device";
import { OS_NAME_ICON } from "@/src/lib/lucideIcons/os";
import { queryIndex } from "@/src/lib/queries";
import { revokeSession } from "@/src/lib/serverActions/revokeSession";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { truncateStringByChar } from "@/src/lib/utils/truncateString";
import TwoChoiceDialog from "@/src/ui/components/ui/TwoChoiceDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import ASNInformation from "./ASNInformation";
import BrowserInformation from "./BrowserInformation";
import DeviceInformation from "./DeviceInformation";
import IpInformation from "./IpInformation";
import IpLocation from "./IpLocation";
import SessionInformation from "./SessionInformation";

export const SessionCard = ({
  session,
  isCurrent,
}: {
  session: ActiveSession;
  isCurrent?: boolean;
}) => {
  const { triggerToast } = useNotificationStore();
  const parsedUA = UAParser(session?.userAgent ?? "");
  const { browser, device, os } = parsedUA;
  const sessionQuery = queryIndex.self.sessions();
  const queryClient = useQueryClient();

  // Get Icon
  const deviceIcon =
    DEVICE_TYPE_ICON[device?.type as keyof typeof DEVICE_TYPE_ICON];
  const osIcon = OS_NAME_ICON[os.name as keyof typeof OS_NAME_ICON];
  const Icon = deviceIcon || osIcon || CircleQuestionMark;

  // LookUp IP
  const ipLookupQuery = queryIndex.ipLocate.lookup(
    session?.ipAddress ?? "undefined",
  );
  const { data: ipLookupResponse } = useQuery({
    ...ipLookupQuery.queryOptions,
    refetchOnWindowFocus: true,
  });

  // Process Ip Lookup Response
  const city = ipLookupResponse?.result?.city || "[no-city-record]";
  const subdivision =
    ipLookupResponse?.result?.subdivision || "[no-subdivision-record]";
  const country = ipLookupResponse?.result?.country || "[no-country-record]";
  const isCompleteBlind =
    !ipLookupResponse?.result?.city &&
    !ipLookupResponse?.result?.subdivision &&
    !ipLookupResponse?.result?.country;

  // Revoke State
  const [revokeSessionDialog, setRevokeSessionDialog] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // More Informtion state
  const [expand, setExpand] = useState(false);

  const { mutate } = useMutation({
    mutationFn: revokeSession,
  });

  // Handle Revoke
  const handleRevoke = async () => {
    if (isCurrent || isRevoking) return;
    setIsRevoking(true);
    try {
      mutate(
        { id: session.id },
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
            throw 1;
          },
        },
      );
    } catch (_error) {
      triggerToast(
        "Something Went Wrong",
        {
          description:
            "Failed to terminate session, try again if the issue persist please contact developer.",
        },
        "error",
      );
    }
    setIsRevoking(false);
    setRevokeSessionDialog(false);
  };

  const isDesktop = useMediaQuery({
    query: "(min-width:768px)",
  });

  return (
    <>
      {/* Card */}
      <div>
        <div className="space-y-2 p-3 bg-muted rounded-2xl flex items-center justify-between">
          {/* Metadata */}
          <div className="flex items-center gap-2">
            {/* Icon */}
            <div>
              <Icon />
            </div>

            {/* Information */}
            <div>
              <h1 className="text-sm md:font-semibold">
                {isCompleteBlind
                  ? "No Information"
                  : truncateStringByChar(
                      `${city}, ${subdivision}, ${country}`,
                      isDesktop ? 48 : 20,
                      true,
                    )}
              </h1>
              <p className="text-xs font-light">
                {browser?.name ?? "[no-browser-data]"},{" "}
                {os?.name ?? "[no-os-detail]"}
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="text-xs rounded-full w-8 h-8"
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  <ChevronDown
                    className={`w-5 h-5 ${expand ? "rotate-z-180" : ""} transition-all duration-300`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {expand ? "Hide" : "More information about this session"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant={isCurrent ? "outline" : "destructive"}
                    size={"sm"}
                    className="text-xs w-8 h-8 md:min-w-24 md:max-w-24"
                    disabled={isCurrent || isRevoking}
                    onClick={() => {
                      if (isCurrent) return;
                      setRevokeSessionDialog(true);
                    }}
                  >
                    {isDesktop ? "Terminate" : <Trash />}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-center px-4">
                {isCurrent
                  ? "This is your current session"
                  : "Terminate this session"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <motion.div
          initial={{ height: 0 }}
          animate={expand ? { height: "auto" } : { height: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-6">
            {/* Session Information */}
            <SessionInformation session={session} />

            {/* Browser Information */}
            <BrowserInformation parsedUA={parsedUA} />

            {/* Device Information */}
            <DeviceInformation parsedUA={parsedUA} />

            {/* IP Information */}
            {ipLookupResponse?.result && (
              <IpInformation ipLookUp={ipLookupResponse?.result} />
            )}

            {/* IP Geolocation */}
            {ipLookupResponse?.result && (
              <IpLocation ipLookUp={ipLookupResponse?.result} />
            )}

            {/* IP ASN Provider */}
            {ipLookupResponse?.result && (
              <ASNInformation ipLookUp={ipLookupResponse?.result} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <TwoChoiceDialog
        title="Terminate Session"
        description={`Are you sure you want to terminate this session?`}
        positiveText={"Revoke"}
        negativeText={"Cancel"}
        open={revokeSessionDialog}
        setOpen={setRevokeSessionDialog}
        positiveProps={{
          onClick: handleRevoke,
          disabled: isRevoking || isCurrent,
          className: "bg-destructive text-destructive-foreground",
        }}
      />
    </>
  );
};
