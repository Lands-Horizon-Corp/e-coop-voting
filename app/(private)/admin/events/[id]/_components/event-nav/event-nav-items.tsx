"use client";
import { TNavListRoute } from "@/types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  route: TNavListRoute;
  eventId: number;
};

const EventNavItems = ({ route, eventId }: Props) => {
  const { icon, path, name } = route;
  const pathname = usePathname();
  const isCurrentPath = pathname.includes(path);

  const finalPath = `/admin/events/${eventId}/${path}`;

  return (
    <Link
      href={finalPath}
      className={` ${isCurrentPath ? "dark:text-primary border-b-[3px] border-primary text-black  hover:font-bold " : " text-muted-foreground/70 dark:text-[#d3d3d3]  dark:hover:text-primary hover:text-black hover:bg-secondary  hover:font-bold "}   border-primary flex cursor-pointer justify-start space-x-2  hover:scale-105`}
    >
      <div
        className={`flex lg:space-x-2 duration-300  items-center px-2 lg:px-5  ease-in-out hover:bg-none   p-2 rounded-xl`}
      >
        <div
          className={` hidden lg:block ${isCurrentPath ? "text-primary " : ""} `}
        >
          {icon}
        </div>
        <h1
          className={`text-[min(15px,2.9vw)] ${isCurrentPath ? "font-bold" : "font-normal hover:font-medium"}`}
        >
          {name}
        </h1>
      </div>
    </Link>
  );
};

export default EventNavItems;
