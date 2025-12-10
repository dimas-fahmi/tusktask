import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const UsernameSection = () => {
  return (
    <section id="username-section" className="space-y-4">
      {/* Header */}
      <SectionHeader
        title="Unique Username"
        description="Change your username"
      />

      {/* Form */}
      <form action="" className="space-y-4">
        {/* Field */}
        <div>
          <Input label="Username" inputProps={{ placeholder: "dimas-fahmi" }} />
        </div>

        {/* Footer */}
        <footer>
          <Button className="block ms-auto" disabled>
            Save
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default UsernameSection;
