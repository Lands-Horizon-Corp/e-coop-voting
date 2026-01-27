import React from "react";
import Link from "next/link";

import RouteItem, { TPublicNavItem } from "./route-item";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { PartyPopper, QrCode } from "lucide-react";

const routes: TPublicNavItem[] = [
  { routeName: "Events", path: "/events", Icon: PartyPopper },
  // { routeName : "QRGen", path : "/qr-generator", Icon : QrCode }
];

const NavBar = () => {
  return (
    <header className="fixed top-0 z-50 flex flex-col items-center w-[100vw] px-4 py-2 lg:p-4 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md">
      <div className="flex items-center justify-between w-full max-w-7xl">
        <Link
          href="/"
          className="text-sm lg:text-lg font-medium inline-flex items-center"
        >
          <span className="text-lg">e</span>Coop ACE{" "}
          <span className="hidden md:block">System</span>
        </Link>
        <div className="flex items-center text-foreground/60 gap-x-5 justify-center">
          {routes.map((route) => (
            <RouteItem key={route.path} {...route} />
          ))}
        </div>
        <div className="flex items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
