"use client";

import DeleteAccount from "../components/DeleteAccount";
import SectionHeader from "../components/SectionHeader";

const AdvanceSection = () => {
  return (
    <section id="advance-section" className="space-y-6">
      <SectionHeader
        title="Advance Section"
        description="This is a dangerous zone"
      />

      <div className="space-y-4">
        <DeleteAccount />
      </div>
    </section>
  );
};

export default AdvanceSection;
