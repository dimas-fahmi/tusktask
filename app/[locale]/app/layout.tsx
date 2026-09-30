import AppNavbar from "@/src/ui/components/Prefab/AppNavbar";
import AppSidebar from "@/src/ui/components/Prefab/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/ui/shadcn/components/ui/sidebar";

const AppLayout = ({ children }: LayoutProps<"/[locale]">) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppNavbar />
        <main className="p-4 md:p-6 lg:p-12 xl:p-16">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default AppLayout;
