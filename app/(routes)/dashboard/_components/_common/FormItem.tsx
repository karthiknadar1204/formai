"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ActivityIcon,
  EllipsisIcon,
  Globe,
  LockKeyholeIcon,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type PropsType = {
  id: number;
  formId: string;
  name: string;
  responses: number;
  views: number;
  createdAt: Date;
  published: boolean;
  backgroundColor: string;
};

const FormItem = (props: PropsType) => {
  const {
    id,
    formId,
    name,
    published,
    createdAt,
    responses = 0,
    views = 0,
    backgroundColor,
  } = props;

  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/dashboard/form/builder/${formId}`);
  }, [formId, router]);

  return (
    <button
      onClick={onClick}
      className="group w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div 
        style={{backgroundColor: backgroundColor || '#4F46E5'}}
        className="w-full h-32 relative p-4 bg-gradient-to-br from-primary/80 to-primary"
      >
        <div className="absolute top-4 right-4">
          {published ? (
            <Globe className="text-white/80 size-5" />
          ) : (
            <LockKeyholeIcon className="text-white/80 size-5" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-white mt-8 truncate pr-8">
          {name}
        </h3>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">{responses}</span>
              <span className="text-xs text-gray-500">Responses</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">{views}</span>
              <span className="text-xs text-gray-500">Views</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <EllipsisIcon className="text-gray-400 size-5 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">
              {published ? 'Published' : 'Draft'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDistanceToNowStrict(new Date(createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </button>
  );
};

export default FormItem;
