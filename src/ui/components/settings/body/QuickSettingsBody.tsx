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
      <AccessibilitySettings key={"accessibility-settings"} />
      <PersonalizationSettings key={"personalization-settings"} />
      {!hideAccountSettings && <AccountSettings key={"account-settings"} />}
    </div>
  );
};
export default QuickSettingsBody;
