import { ObjectBlockType } from "@/@types/form-block.type";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

const BlockBtnElement = ({
  formBlock,
  disabled,
}: {
  formBlock: ObjectBlockType;
  disabled?: boolean;
}) => {
  const { icon: Icon, label } = formBlock.blockBtnElement;

  const draggable = useDraggable({
    id: `block-btn-${formBlock.blockType}`,
    disabled: disabled,
    data: {
      blockType: formBlock.blockType,
      isBlockBtnElement: true,
    },
  });

  return (
    <Button
      disabled={disabled}
      ref={draggable.setNodeRef}
      className={cn(
        `group relative flex items-center justify-start
        h-[85px] w-full cursor-grab
        bg-gradient-to-br from-white to-gray-50
        border border-gray-100 rounded-xl
        text-gray-600 px-4 py-3
        transition-all duration-200
        hover:shadow-lg hover:shadow-primary/5
        hover:border-primary/20 hover:to-white`,
        draggable.isDragging && "ring-2 ring-primary/50 shadow-xl scale-[1.02]",
        disabled && "!cursor-default !pointer-events-none opacity-60"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <div className="flex flex-col items-start gap-2">
        <div className="p-1.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
          <Icon className="w-6 h-6 stroke-[1.5] text-primary/70 group-hover:text-primary transition-colors" />
        </div>
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {label}
          </span>
          <span className="text-[11px] text-gray-400">Drag to add</span>
        </div>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-dashed border-gray-200 group-hover:border-primary/30 transition-colors" />
    </Button>
  );
};

export default BlockBtnElement;
