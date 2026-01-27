import React from "react";
import { TNavListRoute } from "@/types";
import {
  LayoutDashboard,
  Users,
  Medal,
  Settings2,
  Combine,
} from "lucide-react";
import ElectionSideBarItems from "./election-side-bar-item";
import { Card } from "@/components/ui/card";

export const SideBar: TNavListRoute[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    name: "DashBoard",
    path: "dashboard",
  },
  {
    icon: <Combine className="h-5 w-5" />,
    name: "election",
    path: "overview",
  },
  {
    icon: <Users className="h-5 w-5" />,
    name: "Candidates",
    path: "candidates",
  },
  {
    icon: <Medal className="w-5 h-5" />,
    name: "Positions",
    path: "positions",
  },
  {
    icon: <Settings2 className="w-5 h-5" />,
    name: "Settings",
    path: "settings",
  },
];

type Props = {
  params: { id: number; electionId: number };
};

const ElectionSideBar = ({ params }: Props) => {
  return (
    <div className="flex rounded-xl border-gray-200 dark:border-gray-700  bg-muted dark:bg-[#1E1D1E] w-full justify-around">
      {SideBar.map((route: TNavListRoute, i) => (
        <ElectionSideBarItems params={params} route={route} key={i} />
      ))}
    </div>
  );
};

export default ElectionSideBar;
