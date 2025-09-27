"use client";

import * as React from "react";
import Link from "next/link";
import { 
  RiCheckLine, 
  RiArrowDownSLine,
  RiScanLine,
  RiBardLine,
  RiUserFollowLine,
  RiCodeSSlashLine,
  RiLoginCircleLine,
  RiLayoutLeftLine,
  RiLeafLine,
  RiSettings3Line,
  RiDatabase2Line,
  RiChat1Line,
} from "@remixicon/react";

import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const data = {
  user: {
    name: "Sofia Safier",
    email: "sofia@safier.com",
    avatar:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1743935337/user-01_l4if9t.png",
  },
};

const navigationData = {
  navMain: [
    {
      title: "Sections",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: RiScanLine,
        },
        {
          title: "Insights",
          url: "/dashboard/insights",
          icon: RiBardLine,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: RiUserFollowLine,
          isActive: true,
        },
        {
          title: "Data Insights",
          url: "/dashboard/data",
          icon: RiDatabase2Line,
        },
        {
          title: "Chat",
          url: "/dashboard_revamped/chat",
          icon: RiChat1Line,
        },
        {
          title: "Layouts",
          url: "#",
          icon: RiLayoutLeftLine,
        },
        {
          title: "Reports",
          url: "#",
          icon: RiLeafLine,
        },
      ],
    },
    {
      title: "Other",
      url: "#",
      items: [
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: RiSettings3Line,
        },
        {
          title: "Help Center",
          url: "#",
          icon: RiLeafLine,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex justify-between items-center gap-2 px-2">
          <Link className="inline-flex" href="/">
            <span className="sr-only">Logo</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path
                fill="#52525C"
                d="m10.661.863-2.339 1.04 5.251 11.794L1.521 9.072l-.918 2.39 12.053 4.627-11.794 5.25 1.041 2.34 11.794-5.252L9.071 30.48l2.39.917 4.626-12.052 5.251 11.793 2.339-1.04-5.251-11.795 12.052 4.627.917-2.39-12.052-4.627 11.794-5.25-1.041-2.34-11.794 5.252L22.928 1.52l-2.39-.917-4.626 12.052L10.662.863Z"
              />
              <path
                fill="#F4F4F5"
                d="M17.28 0h-2.56v12.91L5.591 3.78l-1.81 1.81 9.129 9.129H0v2.56h12.91L3.78 26.409l1.81 1.81 9.129-9.129V32h2.56V19.09l9.128 9.129 1.81-1.81-9.128-9.129H32v-2.56H19.09l9.129-9.129-1.81-1.81-9.129 9.129V0Z"
              />
            </svg>
          </Link>
          <SidebarTrigger className="text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent!" />
        </div>
      </SidebarHeader>

      <SidebarContent>
       
        {/* Navigation Sections */}
        {navigationData.navMain.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                      isActive={pathname === item.url || (pathname === '/' && item.url === '/dashboard')}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                          size={22}
                          aria-hidden="true"
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}