"use client";
import React, { useEffect } from "react";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import { Accessibility, Users } from "lucide-react";
import Header from "../../_components/header";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";
import ElectionSwitch from "./election-switch";
import ElectionDetails from "./election-details";
import { Candidates } from "./candidates";
import { Positions } from "./positions";
import { Role } from "@prisma/client";
import { user } from "next-auth";
import { toast } from "sonner";

type Props = {
  params?: { id: number; electionId: number };
  user: user;
};

const Election = ({ params, user }: Props) => {
  if (!params) return <NotFound />;

  const { elections, isLoading, error } = getElectionWithPositionAndCandidates({
    params,
  });
  const isStaff = user.role === Role.staff;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) return <Loading />;

  if (!elections) return <NotFound />;

  return (
    <div className="space-y-2 relative">
      <div className="flex text-white w-full space-x-2 items-center justify-between p-2">
        <Header text="Overview" />
        {!isStaff && (
          <ElectionSwitch
            election={elections}
            status={elections.status}
            params={params}
          ></ElectionSwitch>
        )}
      </div>
      <ElectionDetails
        eventDate={elections.event.date}
        election={elections}
      ></ElectionDetails>
      <div className="w-full flex space-x-3 justify-start px-2">
        <Users className="size-5 text-primary" />
        <h1 className="font-medium">Candidates</h1>
      </div>
      <Candidates data={elections?.candidates}></Candidates>
      <div className="w-full flex space-x-3 justify-start px-2">
        <Accessibility className="size-7 text-green-700" />
        <h1 className="font-medium">Positions</h1>
      </div>
      <Positions data={elections.positions}></Positions>
    </div>
  );
};

export default Election;
