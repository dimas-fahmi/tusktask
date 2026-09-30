import AccessibilitySettings from "../blocks/Accessibility";
import AccountSettings from "../blocks/Account";
import PersonalizationSettings from "../blocks/Personalization";

const QuickSettingsBody = ({
  hideAccountSettings,
}: {
  hideAccountSettings?: boolean;
}) => {
  return (
    <div className="space-y-4">
      {!hideAccountSettings && <AccountSettings key={"account-settings"} />}
      <AccessibilitySettings key={"accessibility-settings"} />
      <PersonalizationSettings key={"personalization-settings"} />
    </div>
  );
};
export default QuickSettingsBody;
