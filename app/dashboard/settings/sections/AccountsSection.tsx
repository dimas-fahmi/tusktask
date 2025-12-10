import {
  Apple,
  Discord,
  Facebook,
  Github,
  Google,
} from "@/src/ui/components/icons/brands";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const AccountCard = ({
  name,
  icon: Icon,
}: {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Metadata */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div>
          <Icon className="w-6 h-6 opacity-70" />
        </div>

        {/* Name & Status */}
        <div>
          <h1 className="capitalize">{name}</h1>
          <p className="text-xs font-light">Connected 2 days ago</p>
        </div>
      </div>

      {/* Action */}
      <div>
        <Button size={"sm"} className="text-xs">
          Connected
        </Button>
      </div>
    </div>
  );
};

const AccountsSection = () => {
  return (
    <section id="accounts-section" className="space-y-6">
      <SectionHeader
        title="Connected Accounts"
        description="Managed your social accounts"
      />

      <div className="space-y-4">
        <AccountCard icon={Apple} name="apple" />
        <AccountCard icon={Discord} name="discord" />
        <AccountCard icon={Facebook} name="facebook" />
        <AccountCard icon={Github} name="github" />
        <AccountCard icon={Google} name="google" />
      </div>
    </section>
  );
};

export default AccountsSection;
