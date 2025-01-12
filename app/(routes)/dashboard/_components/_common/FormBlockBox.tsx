"use client";
import BlockBtnElement from "@/components/BlockBtnElement";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useBuilder } from "@/context/builder-provider";
import { FormBlocks } from "@/lib/form-blocks";
import { Search } from "lucide-react";
import React, { useState } from "react";
import AIAssistanceBtn from "./AIAssistanceBtn";

const FormBlockBox = () => {
  const { formData } = useBuilder();
  const isPublished = formData?.published;
  const [search, setSearch] = useState<string>("");

  const filteredBlocks = Object.values(FormBlocks).filter((block) =>
    block.blockBtnElement.label?.toLowerCase().includes(search.toLowerCase())
  );

  const layoutBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Layout"
  );

  const fieldBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Field"
  );

  return (
    <div className="w-full px-2">
      <div className="flex flex-col gap-4 py-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blocks..."
              className="pl-10 bg-gray-50/50 border-gray-200 rounded-xl h-11 placeholder:text-gray-400 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <AIAssistanceBtn />
        </div>
      </div>

      <div className="space-y-6">
        {layoutBlocks?.length > 0 && (
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-1 bg-gradient-to-b from-primary/80 to-primary rounded-full" />
              <h5 className="text-sm font-semibold text-gray-700">
                Layout Blocks
              </h5>
            </div>

            <div className="grid grid-cols-2 gap-3 px-1">
              {layoutBlocks?.map((block) => (
                <div key={block.blockType} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <BlockBtnElement
                    formBlock={block}
                    disabled={isPublished}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-gray-100" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-1 bg-gradient-to-b from-primary/80 to-primary rounded-full" />
            <h5 className="text-sm font-semibold text-gray-700">
              Form Fields
            </h5>
          </div>

          <div className="grid grid-cols-2 gap-3 px-1">
            {fieldBlocks?.map((block) => (
              <div key={block.blockType} className="transform transition-all duration-200 hover:scale-[1.02]">
                <BlockBtnElement
                  formBlock={block}
                  disabled={isPublished}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBlockBox;
