import { authClient } from "@/src/lib/auth/client";
import { useGetSelfSessions } from "@/src/lib/queries/hooks/useGetSelfSessions";
import SectionHeader from "../components/SectionHeader";
import { SessionCard } from "../components/SessionCard";

const ActiveSessionsSection = () => {
  const { data: currentSession } = authClient.useSession();
  const { data: activeSessions } = useGetSelfSessions();

  return (
    <section id="active-sessions-section" className="space-y-6">
      <SectionHeader
        title="Active Sessions"
        description="Managed your TuskTask account sessions"
      />

      <div className="space-y-4">
        {activeSessions?.map((session) => (
          <SessionCard
            key={session.id}
            isCurrent={currentSession?.session?.id === session?.id}
            session={session}
          />
        ))}
      </div>
    </section>
  );
};

export default ActiveSessionsSection;
