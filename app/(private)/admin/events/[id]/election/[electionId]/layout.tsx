import React, { ReactNode } from "react";
import ElectionSideBar from "./_components/sidebar/election-sidebar";

type Props = {
  children: ReactNode;
  params: { id: number; electionId: number };
};

const EventLayout = ({ children, params }: Props) => {
  return (
    <div className="font-poppins pt-5 lg:p-3 h-fit w-full overflow-hidden">
      <ElectionSideBar params={params} />
      <div className="flex w-full py-2 flex-col lg:flex-row">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default EventLayout;
