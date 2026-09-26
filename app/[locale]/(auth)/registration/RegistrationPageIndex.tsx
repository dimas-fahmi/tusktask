"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { RENDERABLE_REGISTRATION_STEP } from "@/src/app/registrationPhase/renderable";
import route from "@/src/app/route";
import { useMyData } from "@/src/hooks/useMyData";
import { useRegistrationStep } from "@/src/hooks/useRegistrationStep";

const RegistrationPageIndex = () => {
  const [current, setCurrent] = useRegistrationStep(
    useShallow((s) => [s.current, s.setCurrent]),
  );

  const { data: myData, isPending, isFetching } = useMyData();

  const router = useRouter();

  useEffect(() => {
    if (isFetching || isPending) return;

    if (myData?.registrationStep === "completed") {
      return router.push(route.app());
    }

    if (!current && myData) {
      setCurrent(myData?.registrationStep);
    }
  }, [myData, isPending, isFetching, current, setCurrent, router]);

  const Render = current ? RENDERABLE_REGISTRATION_STEP[current] : null;

  return Render ? <Render /> : <div>Loading...</div>;
};
export default RegistrationPageIndex;
