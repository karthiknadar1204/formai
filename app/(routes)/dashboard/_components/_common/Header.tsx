"use client";
import React from "react";
import Link from "next/link";
import {
  useKindeBrowserClient,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs";
import { useParams, usePathname } from "next/navigation";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogInIcon } from "lucide-react";

const Header = () => {
  const { user } = useKindeBrowserClient();

  const pathname = usePathname();
  const { formId } = useParams();

  const NAV_MENUS = [
    {
      name: "Dashboard",
      pathname: "/dashboard",
      isDisabled: false,
    },
    {
      name: "Builder",
      pathname: `/dashboard/form/builder/${formId}`,
      isDisabled: true,
    },
    {
      name: "Responds",
      pathname: `/dashboard/form/responds/${formId}`,
      isDisabled: true,
    },
    {
      name: "Settings",
      pathname: "#",
      isDisabled: false,
    },
  ];

  return (
    <header
      className="
    sticky top-0 z-50 flex h-16 items-center gap-4 
    bg-black px-4 md:px-6
    "
    >
      <nav
        className="gap-6 w-full h-full
           text-lg font-medium flex justify-between flex-row"
      >
        <div
          className="flex flex-1 items-center mr-5 pr-8 
         border-r border-gray-300"
        >
          <Logo url="/dashboard" />
          <span className="sr-only">Fomai</span>
        </div>
        <ul className="hidden md:flex flex-row">
          {NAV_MENUS.map((item, idx) => (
            <li key={idx} className="relative h-full">
              <Link
                href={item.pathname}
                className={cn(
                  `
                    text-white text-[15.5px]
              font-normal z-[999] flex items-center px-3
              justify-center h-full transition-colors 
              hover:text-gray-200
                        `,
                  {
                    "opacity-50 !pointer-events-none": item.isDisabled,
                  }
                )}
              >
                {item.name}
              </Link>
              {pathname === item.pathname && (
                <div
                  className="absolute 
                          top-0 
                          left-0
                          right-0 
                          h-[52px]
                          bg-white
                          transition-colors
                          ease-in-out
                          rounded-b-xl
                          opacity-10
                          -z-[1]"
                />
              )}
            </li>
          ))}
        </ul>

        <div
          className="flex 
        items-center gap-1
        justify-end w-full"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex
              items-start gap-2
              focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg
              "
              >
                <Avatar
                  className="h-8 w-8 bg-white shrink-0 
                rounded-full"
                >
                  <AvatarImage
                    src={user?.picture || ""}
                    alt={user?.given_name || ""}
                  />
                  <AvatarFallback className="rounded-lg bg-gray-200 text-black">
                    {user?.given_name?.charAt(0)}
                    {user?.family_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <div
                    className="grid flex-1 text-left text-sm 
                  leading-tight
                  "
                  >
                    <span className="truncate font-semibold text-white">
                      {user?.given_name} {user?.family_name}
                    </span>
                    <p
                      className="truncate 
                        block 
                        w-full 
                        max-w-[150px] text-xs
                     text-gray-400"
                    >
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-white" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem>
                <LogoutLink className="flex items-center gap-1 text-black">
                  <LogInIcon className="w-4 h-4" />
                  Logout
                </LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
