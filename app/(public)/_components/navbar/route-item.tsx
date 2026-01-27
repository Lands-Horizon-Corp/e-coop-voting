import React from "react";
import Link from "next/link";

export type TPublicNavItem = {
  routeName: string;
  path: string;
  Icon: React.ElementType;
};

const RouteItem = ({ routeName, path, Icon }: TPublicNavItem) => {
  return (
    <Link
      href={path}
      className="duration-200 px-3 py-2 text-foreground rounded-full bg-secondary/20 hover:bg-background/70 ease-in flex items-center gap-x-2"
    >
      <Icon className="size-4 md:size-5" strokeWidth={1} /> {routeName}
    </Link>
  );
};

export default RouteItem;
