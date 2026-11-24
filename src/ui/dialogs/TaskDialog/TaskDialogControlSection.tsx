import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "cn";
import { motion } from "motion/react";
import { useState } from "react";

const TaskDialogControlSection = ({
  children,
  title,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  title?: string;
}) => {
  const [expand, setExpand] = useState(true);

  return (
    <div
      {...props}
      className={cn("space-y-2 grid grid-cols-1", props?.className)}
    >
      <button
        type="button"
        className="text-center flex items-center justify-between gap-4 px-3"
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <h2 className="uppercase text-xs font-semibold opacity-50">{title}</h2>

        <IconChevronDown
          className={cn(
            "w-4 h-4 transition-all duration-200",
            expand ? "rotate-180" : "rotate-0",
          )}
          stroke={1}
        />
      </button>

      <motion.div
        initial={{
          height: "auto",
        }}
        animate={expand ? { height: "auto" } : { height: 0 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
};
export default TaskDialogControlSection;
