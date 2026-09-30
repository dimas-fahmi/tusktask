import { IconBell } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useMyData } from "@/src/hooks/useMyData";
import { usePreferences } from "@/src/hooks/usePreferences";
import { getQueryClient, useTRPC } from "@/src/lib/trpc/client/client";
import { Switch } from "@/src/ui/shadcn/components/ui/switch";
import { SettingItem, SettingItemAction, SettingItemInfo } from "..";

const NotificationSoundSettingItem = () => {
  const t = useTranslations();

  const [soundNotification, _setSoundNotification] = usePreferences(
    useShallow((s) => [
      s.states.soundNotification,
      s.actions.setSoundNotification,
    ]),
  );

  const trpc = useTRPC();
  const { queryKey } = useMyData();
  const qc = getQueryClient();
  const { toast } = useHandleQueryError();

  const { mutate, isPending } = useMutation({
    ...trpc.myData.update.mutationOptions(),
    onMutate: async (data, ctx) => {
      await ctx.client.cancelQueries({
        queryKey: queryKey,
      });

      const prevData = ctx.client.getQueryData(queryKey);

      if (prevData) {
        ctx.client.setQueryData(queryKey, () => ({
          ...prevData,
          ...data,
        }));
      }

      return { prevData };
    },
    onError: (err, _newData, onMutateResult, ctx) => {
      toast("failed_user_mutation", err, true);

      if (onMutateResult?.prevData) {
        ctx.client.setQueryData(queryKey, onMutateResult?.prevData);
      }
    },
    onSuccess: () => {},
    onSettled: () => {
      qc.invalidateQueries({
        queryKey,
      });
    },
  });

  return (
    <SettingItem>
      <SettingItemInfo icon={IconBell} name={t("common.notification_sound")} />

      <SettingItemAction>
        <Switch
          disabled={isPending}
          checked={soundNotification}
          onCheckedChange={(value) => {
            mutate({
              soundNotification: value,
            });
          }}
        />
      </SettingItemAction>
    </SettingItem>
  );
};
export default NotificationSoundSettingItem;
