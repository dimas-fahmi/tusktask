import { triggerToast } from "../utils/triggerToast";

export const userMutationErrorHandler = ({
  data,
  setLoading,
}: {
  data: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  triggerToast({
    type: "error",
    title: data.userFriendly ? data.code : "Operation Failed",
    duration: 10000,
    description: data.userFriendly
      ? typeof data.message === "string"
        ? data.message
        : data.message._errors[0]
      : "Please try again, if the issue persist please contact support.",
  });
  setLoading(false);
};
