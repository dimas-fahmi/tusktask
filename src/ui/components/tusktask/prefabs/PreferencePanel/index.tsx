import React from "react";
import { Switch } from "../../../shadcn/ui/switch";

interface PreferencePanelProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

const PreferencePanel: React.FC<PreferencePanelProps> = ({
  title,
  description,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="px-4 py-2 border rounded-md flex items-center justify-between gap-2">
      {/* Information */}
      <header>
        <h1 className="font-bold">{title}</h1>
        <p className="text-xs">{description}</p>
      </header>

      {/* Controller */}
      <div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
};

export default PreferencePanel;
