import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import BuilderSidebar from "./BuilderSidebar";
import { defaultBackgroundColor } from "@/constant";
import BuilderCanvas from "./BuilderCanvas";
import BuilderBlockProperties from "./BuilderBlockProperties";
import FloatingShareButton from "./_common/FloatingShareButton";

const Builder = (props: { isSidebarOpen: boolean }) => {
  return (
    <>
      <BuilderSidebar />
      <SidebarInset className="!p-0 flex-1 relative">
        <div
          className="w-full h-full"
          style={{
            backgroundColor: 'hsl(var(--builder-background))'
          }}
        >
          <SidebarTrigger className="absolute top-0 left-0 z-[60]" />
          <BuilderCanvas />
          <FloatingShareButton isSidebarOpen={props.isSidebarOpen} />
        </div>
      </SidebarInset>
      <BuilderBlockProperties />
    </>
  );
};

export default Builder;