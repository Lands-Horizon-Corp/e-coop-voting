import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  text: string;
  className?: string;
};

const Header = ({ text, className }: Props) => {
  return (
    <div
      className={cn("w-full p-2", className)}
    >
      <h1 className="font-bold text-2xl">{text}</h1>
    </div>
  );
};

export default Header;
