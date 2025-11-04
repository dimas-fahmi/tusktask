import { OverviewCard } from "../components/OverviewCard";

const OverviewSection = () => {
  return (
    <section id="whosin">
      <div className="p-4 md:p-6 lg:p-16 flex md:justify-center overflow-x-scroll scrollbar-none items-center min-h-[580px] outline-0 px-6 md:px-0">
        <OverviewCard
          title="Stay in Flow"
          description="Those who want to stay focused with our built-in pomodoro."
          image="/assets/arts/png/lp-art-study.png"
        />
        <OverviewCard
          title="Get Things Done"
          description="Those juggling daily tasks and looking to develop better habits."
          image="/assets/arts/png/lp-art-chore.png"
        />
        <OverviewCard
          title="Chaos To Order"
          description="Those who struggle to keep their task organized."
          image="/assets/arts/png/lp-art-confuse.png"
        />
        <OverviewCard
          title="Never Miss A Beat"
          description="Those who need to track deadlines and stay ahead of schedule."
          image="/assets/arts/png/lp-art-passed-deadline.png"
        />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold">
          All Of Them Use <span className="text-primary">TuskTask</span>
        </h1>
        <p>And they live happily ever after</p>
      </div>
    </section>
  );
};

export default OverviewSection;
