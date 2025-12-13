import type { Metadata } from "next";
import ControllerSection from "./components/ControllerSection";
import HeaderSection from "./components/HeaderSection";
import SubtasksSection from "./components/SubtasksSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: _id } = await params;

  return {
    title: `Hello World | TuskTask`,
  };
}

const TaskDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="pt-8 md:px-6 lg:px-16 min-h-dvh">
      {/* Main Content */}
      <div className="space-y-24">
        <div className="space-y-4">
          {/* Controller */}
          <ControllerSection />

          {/* Header */}
          <HeaderSection id={id} />
        </div>

        {/* Subtasks */}
        <SubtasksSection />
      </div>
    </div>
  );
};

export default TaskDetailPage;
