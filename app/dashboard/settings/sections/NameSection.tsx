import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const NameSection = () => {
  return (
    <section id="name-section" className="space-y-4">
      {/* Header */}
      <SectionHeader
        title="Name & Display Name"
        description="Change your name & display name"
      />

      {/* Form */}
      <form action="" className="space-y-4">
        {/* Fields */}
        <div className="space-y-4">
          <div>
            <Input
              label="Display Name"
              inputProps={{ placeholder: "Arthur Morgan" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Display Name"
              inputProps={{ placeholder: "Arthur Morgan" }}
            />
            <Input
              label="Display Name"
              inputProps={{ placeholder: "Arthur Morgan" }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer>
          <Button className="ms-auto block" disabled>
            Save
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default NameSection;
