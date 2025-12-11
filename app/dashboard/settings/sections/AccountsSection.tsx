import { useGetSelfAccounts } from "@/src/lib/queries/hooks/useGetSelfAccounts";
import {
  Apple,
  Discord,
  Facebook,
  Github,
  Google,
} from "@/src/ui/components/icons/brands";
import { AccountCard } from "../components/AccountCard";
import SectionHeader from "../components/SectionHeader";

const PROVIDERS = [
  { name: "apple", icon: Apple },
  { name: "discord", icon: Discord },
  { name: "facebook", icon: Facebook },
  { name: "github", icon: Github },
  { name: "google", icon: Google },
];

const AccountsSection = () => {
  const { data: accounts } = useGetSelfAccounts();

  return (
    <section id="accounts-section" className="space-y-6">
      <SectionHeader
        title="Connected Accounts"
        description="Manage your social accounts for your login method"
      />

      <div className="space-y-4">
        {PROVIDERS.map((provider, index) => {
          const account = accounts?.find((t) => t.providerId === provider.name);
          const isLastAccount = (accounts?.length || 0) <= 1 && !!account;
          const isNotSupported =
            provider.name === "facebook" || provider.name === "apple";

          return (
            <AccountCard
              key={`${provider.name}-${index}`}
              icon={provider.icon}
              name={provider.name}
              isConnected={!!account}
              account={account}
              disabled={isLastAccount || isNotSupported}
              isNotSupported={isNotSupported}
              isLastAccount={isLastAccount}
            />
          );
        })}
      </div>
    </section>
  );
};

export default AccountsSection;
