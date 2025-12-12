"use client";

const HeaderSection = ({ id: _id }: { id: string }) => {
  return (
    <section id="header-section" className="space-y-6">
      {/* Task Title Block */}
      <div className="space-y-24">
        <span className="font-light text-xs">Task Title</span>
        <h1 className="flex items-center gap-2 text-2xl md:text-4xl font-semibold">
          {/* Task Name */}
          <span className="">Finish Get Endpoint for Movies</span>
        </h1>
      </div>

      {/* Task Description */}
      <p className="font-extralight">No description</p>
    </section>
  );
};

export default HeaderSection;
