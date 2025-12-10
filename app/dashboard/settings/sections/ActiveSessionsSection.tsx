import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const SessionCard = ({
  type,
  location,
  ip,
  userAgent,
}: {
  type: "desktop" | "mobile";
  location: string;
  ip: string;
  userAgent: string;
}) => {
  const Icon = type === "desktop" ? Monitor : Smartphone;

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
          <h1 className="font-semibold">{location}</h1>
          <p className="text-xs font-light">
            {ip}, {userAgent}.
          </p>
        </div>
      </div>

      {/* Action */}
      <div>
        <Button variant={"destructive"} size={"sm"} className="text-xs">
          Delete
        </Button>
      </div>
    </div>
  );
};

const ActiveSessionsSection = () => {
  return (
    <section id="active-sessions-section" className="space-y-6">
      <SectionHeader
        title="Active Sessions"
        description="Managed your TuskTask account sessions"
      />

      <div className="space-y-4">
        <SessionCard
          type="desktop"
          ip="103.147.9.45"
          location="Bandung, West Java, Indonesia."
          userAgent="Chrome"
        />

        <SessionCard
          type="mobile"
          ip="127.0.0.1"
          location="Bandung, West Java, Indonesia."
          userAgent="Safari"
        />
      </div>
    </section>
  );
};

export default ActiveSessionsSection;
