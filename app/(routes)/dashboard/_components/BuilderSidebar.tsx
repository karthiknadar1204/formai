"use client";
import { useState } from "react";
import type { ComponentProps } from "react";
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
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { FileTextIcon, Home } from "lucide-react";
import FormBlockBox from "./_common/FormBlockBox";
import { useBuilder } from "@/context/builder-provider";

const BuilderSidebar = ({
  rest,
}: {
  rest?: React.ComponentProps<typeof Sidebar>;
}) => {
  const { formData } = useBuilder();

  const [tab, setTab] = useState<"blocks">("blocks");

  return (
    <Sidebar 
      className="border-r fixed left-0 sm:left-[45px] top-16 pt-0 w-[85vw] sm:w-[300px] 
        bg-white z-50 h-[calc(100vh_-_64px)]" 
      {...rest}
    >
      <SidebarHeader className="bg-white px-0 sticky top-0">
        <header className="border-b border-gray-200 w-full pt-3 pb-2 flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3 sm:px-4 overflow-hidden">
            <Home className="min-w-4 h-4" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1">
                    <FileTextIcon className="w-4 h-4 mb-[3px]" />
                    <h5 className="truncate max-w-[110px] text-sm">
                      {formData?.name || "Untitled"}
                    </h5>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarHeader>

      <SidebarContent className="pt-2 px-3 sm:px-5 bg-white h-[calc(100vh_-_128px)] overflow-y-auto">
        <div className="w-full">
          <div className="w-full flex flex-row gap-1 h-[39px] rounded-full bg-gray-100 p-1">
            <button
              type="button"
              className={cn(
                `p-[5px] flex-1 bg-transparent transition-colors ease-in-out 
                rounded-full text-center font-medium text-sm`,
                {
                  "bg-white": tab === "blocks",
                }
              )}
              onClick={() => setTab("blocks")}
            >
              Blocks
            </button>
          </div>
          {tab === "blocks" && <FormBlockBox />}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;