import useDateOptions from "@/src/lib/tusktask/hooks/data/useDateOptions";
import SelectInput from "@/src/ui/components/tusktask/inputs/SelectInput";
import { birthDateSchema } from "@/src/zod/birthDate";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegistrationFlowContext from "@/src/lib/tusktask/hooks/context/useRegistrationFlowContext";
import { getMonths } from "@/src/lib/tusktask/utils/getDate";
import { useMutation } from "@tanstack/react-query";
import { mutateUserData } from "@/src/lib/tusktask/mutators/mutateUserData";
import { UsersPatchApiRequest, UsersPatchApiResponse } from "@/src/types/api";
import { useSession } from "next-auth/react";
import { triggerToast } from "@/src/lib/tusktask/utils/triggerToast";
import { UserType } from "@/src/db/schema/users";

const BirthDatePhase = () => {
  // Next Step after this
  const next: UserType["registration"] = "personal";

  // Pull the session
  const { data: session, update } = useSession();

  // Pull setters from context
  const { setCanContinue, setOnContinue, setLoading } =
    useRegistrationFlowContext();

  // Initialize Form
  const {
    control,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(birthDateSchema),
    mode: "onChange",
    defaultValues: {
      month: "",
      day: "",
      year: "",
    },
  });

  // Listen to month & year
  const month = watch("month");
  const year = watch("year");
  const day = watch("day");

  // Get Dynamics options for dates
  const { days, months, years } = useDateOptions(month, year);

  // Passed State
  const [passed, setPassed] = useState(false);

  // Mutation Initilialization
  const { mutate } = useMutation<
    UsersPatchApiResponse,
    UsersPatchApiResponse,
    UsersPatchApiRequest
  >({
    mutationFn: mutateUserData,
    onSuccess: (data) => {
      triggerToast({
        type: "success",
        title: "Success",
        duration: 10000,
        description: "Thank you, we'll take you to the next step.",
      });
      setLoading(false);
      setTimeout(async () => {
        setPassed(true);
        await update({
          user: {
            registration: next,
          },
        });
      }, 1000);
    },
    onError: (data) => {
      console.log(data);
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
      console.log(data);
    },
  });

  // Listen to forms changes and validation
  useEffect(() => {
    setCanContinue(isValid);
    if (isValid) {
      setOnContinue(() =>
        handleSubmit((data) => {
          if (!session?.user?.id) return;
          setLoading(true);
          const monthIndex = getMonths().indexOf(data.month);
          const birthDate = new Date(data.year, monthIndex + 1, data.day);
          const request: UsersPatchApiRequest = {
            userId: session?.user?.id,
            trigger: "personal",
            newValue: {
              birthDate,
              registration: next,
            },
          };

          mutate(request);
        })
      );
    }
  }, [isValid, day, year, month, setCanContinue, setOnContinue, setLoading]);

  return (
    <div
      className={`${passed && "-translate-x-[1000px]"} space-y-6 transition-all duration-700`}
    >
      <header>
        <h2 className="text-3xl font-primary font-bold">
          Let's Get to Know You
        </h2>
        <p className="text-sm text-tt-primary-foreground/70">
          Your birth date stays private—it's just to confirm you're old enough.
        </p>
      </header>
      <div className="flex gap-2">
        <Controller
          control={control}
          name="month"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1 flex-1/2">
              <SelectInput
                label="Month"
                placeholder="Month"
                items={months}
                className="w-full"
                selectSize={"lg"}
                error={fieldState.error ? true : false}
                {...field}
              />
              {fieldState.error && (
                <p className="text-tt-tertiary text-xs">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="day"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1 flex-1/4">
              <SelectInput
                label="Day"
                placeholder="Day"
                items={days}
                className="w-full"
                selectSize={"lg"}
                error={fieldState.error ? true : false}
                {...field}
              />
              {fieldState.error && (
                <p className="text-tt-tertiary text-xs">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="year"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1 flex-1/4">
              <SelectInput
                label="Years"
                placeholder="Years"
                items={years}
                className="w-full"
                selectSize={"lg"}
                error={fieldState.error ? true : false}
                {...field}
              />
              {fieldState.error && (
                <p className="text-tt-tertiary text-xs">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BirthDatePhase;
