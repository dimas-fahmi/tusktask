import { LoaderIcon } from "lucide-react";

const Loader = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex-center">
      <div className="flex flex-col items-center gap-4">
        {/* Icon */}
        <LoaderIcon className="animate-spin" />

        {/* Header & Body */}
        <div className="text-center">
          <h1 className="text-xl font-semibold">{title ?? "Wait a moment"}</h1>
          <p className="text-sm font-light">
            {description ?? "We're loading your data"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
