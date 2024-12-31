import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = (props: { url?: string; color?: string }) => {
  const { url = "/", color = "text-white" } = props;
  return (
    <div
      className="flex items-center justify-center
  sm:justify-start
    "
    >
      <Link href={url} className="flex items-center gap-2">
        <div className="relative flex items-center justify-center overflow-hidden size-[30px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black rounded-lg transform rotate-45" />
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-700 to-transparent opacity-50 rounded-lg" />
          <span className="relative text-white font-bold italic font-mono" style={{ fontSize: "15px" }}>
            F
          </span>
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-12" />
        </div>
        <h5
          className={cn(
            `font-bold text-[20px]
               tracking-[-0.07em] `,
            color
          )}
        >
          Formify
        </h5>
      </Link>
    </div>
  );
};

export default Logo;