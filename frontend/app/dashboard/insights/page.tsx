"use client"
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Chart01 } from "@/components/insights/chart-01";
import { Chart02 } from "@/components/insights/chart-02";
import { Chart03 } from "@/components/insights/chart-03";
import { Chart04 } from "@/components/insights/chart-04";
import { Chart05 } from "@/components/insights/chart-05";
import { Chart06 } from "@/components/insights/chart-06";
import { ActionButtons } from "@/components/insights/action-buttons";
import { Chart07 } from "@/components/insights/chart-07";
import { Chart08 } from "@/components/insights/chart-08";

export default function Page() {
  const { open } = useSidebar();

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6">
      <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b mb-6">
        {/* Left side */}
        <SidebarTrigger
                data-state={open ? "invisible" : "visible"}
                className="peer size-7 text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent! sm:-ms-1.5 lg:data-[state=invisible]:opacity-0 lg:data-[state=invisible]:pointer-events-none transition-opacity ease-in-out duration-200"
                
              />
        <div className="flex flex-1 items-center gap-2">
          <div className="max-lg:hidden lg:contents">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        {/* Right side */}
        <ActionButtons />
      </header>

      <div className="grid auto-rows-min grid-cols-1 md:grid-cols-2 *:-ms-px *:-mt-px -m-px border border-border/40">
        <div className="border-r border-t border-border/40 p-4 md:col-span-2">
          <Chart01 />
        </div>
        <div className="border-r border-t border-border/40 p-4">
          <Chart02 />
        </div>
        <div className="border-r border-t border-border/40 p-4">
          <Chart03 />
        </div>
        <div className="border-r border-t border-border/40 p-4">
          <Chart04 />
        </div>
        <div className="border-r border-t border-border/40 p-4">
          <Chart05 />
        </div>
        <div className="border-r border-t border-border/40 p-4">
          <Chart06 />
        </div>
        <div className="border-r border-t border-border/40 p-4">
          <Chart08 />
        </div>
        <div className="border-r border-t border-border/40 p-4 md:col-span-2">
          <Chart07 />
        </div>
      </div>
    </div>
  );
}