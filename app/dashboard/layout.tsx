"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import type React from "react";
import { signout } from "@/src/lib/auth/helper/signout";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import { useNotificationStore } from "@/src/lib/stores/notification";
import Header from "@/src/ui/components/page/dashboard/header";
import { DashboardSidebar } from "@/src/ui/components/page/dashboard/sidebar";
import Alert from "@/src/ui/components/ui/Alert";
import Loader from "@/src/ui/components/ui/Loader";
import ProfileDialog from "@/src/ui/components/ui/ProfileDialog";
import ViewPickerModal from "@/src/ui/components/ui/ViewPickerModal";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/ui/shadcn/components/ui/sidebar";

const DashboardLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const pathname = usePathname();

  const { data: profileData, isLoading: isLoadingProfile } =
    useGetSelfProfile();
  const profile = profileData?.result;

  const {
    data: projectData,
    isLoading: isLoadingProjects,
    isError: isErrorLoadingProject,
  } = useGetSelfProjects();
  const projects = projectData?.result?.result;

  if (!isLoadingProfile && profile?.deletedAt) {
    redirect("/account/deleted");
  }

  if (
    !isLoadingProfile &&
    typeof profile?.onboardingStatus === "string" &&
    profile?.onboardingStatus !== "completed"
  ) {
    redirect("/onboarding");
  }

  if (!isLoadingProjects && isErrorLoadingProject) {
    setTimeout(() => {
      signout();
    }, 1500);
  }

  if (
    !isLoadingProjects &&
    typeof projects !== "undefined" &&
    !projects?.length &&
    pathname !== "/empty/projects"
  ) {
    redirect("/empty/projects");
  }

  const { notificationStatus, triggerToast } = useNotificationStore();

  return !profile || isLoadingProfile ? (
    <Loader />
  ) : (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <main className="p-4 md:p-6 lg:p-12 space-y-4 md:space-y-6">
          {/* Layout Header */}
          <Header />

          {/* Alert */}
          <div className="space-y-4">
            {notificationStatus === "denied" && (
              <Alert
                title="Notifications are Blocked"
                description="Notifications are blocked, so TuskTask can't send you any alerts. Some features might not work as expected."
                variant={"destructive"}
              >
                {/* Todo: create dedicated guide dialog later, fine for now. */}
                <Button variant={"destructive"} asChild>
                  <Link
                    href={
                      "https://support.google.com/chrome/answer/3220216?hl=en&co=GENIE.Platform%3DDesktop"
                    }
                    target="_blank"
                  >
                    Learn More
                  </Link>
                </Button>
              </Alert>
            )}

            {notificationStatus === "default" && (
              <Alert
                title="Notification Permission"
                description="You haven't allowed TuskTask to send notifications, so some features might not function properly."
              >
                <Button
                  variant={"outline"}
                  onClick={() => {
                    if (typeof Notification === "undefined") {
                      triggerToast(
                        "Notifications are Not Supported",
                        {
                          description:
                            "Notifications are not supported in your browser, TuskTask won't be able to send you notification.",
                        },
                        "error",
                      );
                    }

                    Notification.requestPermission().then((e) => {
                      useNotificationStore.setState({ notificationStatus: e });

                      if (e === "granted") {
                        triggerToast("Notification Enabled", {
                          description:
                            "TuskTask now able to send you notifications",
                        });
                      }

                      if (e === "denied") {
                        triggerToast(
                          "Permission Rejected",
                          {
                            description:
                              "TuskTask won't be able to send you notifications",
                          },
                          "error",
                        );
                      }
                    });
                  }}
                >
                  Give Permission
                </Button>
              </Alert>
            )}
          </div>

          {/* Main Content */}
          <div className="">{children}</div>
        </main>
      </SidebarInset>

      <ProfileDialog />
      <ViewPickerModal />
    </SidebarProvider>
  );
};

export default DashboardLayout;
