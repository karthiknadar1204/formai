"use client";
import React from "react";
import Link from "next/link";
import {
  useKindeBrowserClient,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";
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

  const NAV_MENUS = [
    {
      name: "Dashboard",
      pathname: "/dashboard",
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 shadow-xl">
      <nav className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Logo url="/dashboard" />
            <span className="sr-only">Formify</span>
            
            <ul className="hidden md:flex items-center space-x-1">
              {NAV_MENUS.map((item) => (
                <li key={item.name} className="relative">
                  <Link
                    href={item.pathname}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      pathname === item.pathname
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button" 
                  className="flex items-center gap-3 px-4 py-2 rounded-full transition-all 
                  duration-200 hover:bg-gray-800/50 group"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-gray-700 shadow-md group-hover:ring-primary/50 transition-all">
                    <AvatarImage
                      src={user?.picture || ""}
                      alt={user?.given_name || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-600 text-white font-medium">
                      {user?.given_name?.charAt(0)}
                      {user?.family_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-100 group-hover:text-white transition-colors">
                      {user?.given_name} {user?.family_name}
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 truncate max-w-[150px] transition-colors">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2 bg-gray-900 border-gray-800">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
                  <LogoutLink className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full transition-colors">
                    <LogInIcon className="w-4 h-4" />
                    <span>Sign out</span>
                  </LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
