"use client";
import { cn } from "@/lib/utils";
import { Blocks, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { AnimatedTooltip } from "../animated-tooltip";

type NavType = {
  id: number;
  title: string;
  url: string;
  icon: LucideIcon;
  designation?: string;
};

const SideMenu = () => {
  const { formId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const navMenus: NavType[] = [
    {
      id: 1,
      title: "Builder",
      url: `/dashboard/form/builder/${formId}`,
      icon: Blocks,
      designation: "Form Builder",
    },
    {
      id: 2,
      title: "Responds",
      url: `/dashboard/form/responds/${formId}`,
      icon: MessageSquare,
      designation: "Form Responses",
    },
  ];

  // Function to render icon as React element
  const renderIcon = (Icon: LucideIcon) => {
    return <Icon className="w-6 h-6 text-white" />;
  };

  return (
    <div
      className="fixed h-screen z-40 -ml-1
      -mt-1 -mb-1 w-[50px] pt-5 border-r shadow-sm bg-black
      text-white"
    >
      <div className="p-0 flex items-center flex-col gap-4">
        <div className="flex flex-col gap-4">
          {navMenus.map((item) => (
            <button
              key={item.title}
              type="button"
              className={cn(
                "p-2 rounded-md transition-colors hover:bg-white/10",
                pathname === item.url && "bg-white/20"
              )}
              onClick={() => router.push(item.url)}
            >
              {renderIcon(item.icon)}
              <span className="sr-only">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
