import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | TuskTask",
};

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <div>
          <h1 className="text-4xl font-semibold">Notifications</h1>
          <p className="text-sm font-light opacity-70">
            Regularly review your notifications to stay updated on current
            events
          </p>
        </div>
      </header>

      <div>
        <span className="text-xs font-light opacity-70">
          No unread notification, good job!
        </span>
      </div>
    </div>
  );
};

export default NotificationsPage;
