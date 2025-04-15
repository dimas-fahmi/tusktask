import useDateOptions from "@/src/lib/tusktask/hooks/data/useDateOptions";
import AnimatedEntry from "@/src/ui/components/tusktask/animation/AnimatedEntry";
import SelectInput from "@/src/ui/components/tusktask/inputs/SelectInput";
import { birthDateSchema } from "@/src/zod/birthDate";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const BirthDatePhase = () => {
  const {
    control,
    watch,
    formState: { errors, isValid, isValidating },
  } = useForm({
    resolver: zodResolver(birthDateSchema),
    mode: "onChange",
    defaultValues: {
      month: "",
      day: "",
      year: "",
    },
  });

  const month = watch("month");
  const year = watch("year");

  const { days, months, years } = useDateOptions(month, year);

  useEffect(() => {
    console.log(month, year);
  }, [month, year]);

  return (
    <div className="space-y-6">
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
            <>
              <SelectInput
                label="Month"
                placeholder="Month"
                items={months}
                className="flex-1/2"
                selectSize={"lg"}
                {...field}
              />
              {fieldState.error && <p>{fieldState.error.message}</p>}
            </>
          )}
        />

        <Controller
          control={control}
          name="day"
          render={({ field, fieldState }) => (
            <>
              <SelectInput
                label="Day"
                placeholder="Day"
                items={days}
                className="flex-1/4"
                selectSize={"lg"}
                {...field}
              />
              {fieldState.error && <p>{fieldState.error.message}</p>}
            </>
          )}
        />

        <Controller
          control={control}
          name="year"
          render={({ field, fieldState }) => (
            <>
              <SelectInput
                label="Year"
                placeholder="Year"
                items={years}
                selectSize={"lg"}
                className="flex-1/4"
                {...field}
              />
              {fieldState.error && <p>{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default BirthDatePhase;
