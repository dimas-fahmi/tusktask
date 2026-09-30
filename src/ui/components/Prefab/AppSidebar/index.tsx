import { Sidebar, SidebarHeader } from "@/src/ui/shadcn/components/ui/sidebar";
import UserNavCard from "../../ui/UserNavCard";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <UserNavCard />
      </SidebarHeader>
    </Sidebar>
  );
};
export default AppSidebar;
