"use client";
import { useSession } from "next-auth/react";
import React from "react";

import Header from "../_components/header";
import Loading from "../_components/loading";
import NotFound from "../_components/not-found";
import CandidateTable from "./_components/candidate-table";
import NotAllowed from "../../../_components/not-allowed";

import { isAllowed } from "@/lib/utils";
import { TCandidatewithPosition } from "@/types";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";

type Props = {
  params: { id: number; electionId: number };
};

const page = ({ params }: Props) => {
  const { data, status } = useSession();
  const { elections, isLoading } = getElectionWithPositionAndCandidates({
    params,
  });

  if (isLoading || status === "loading") return <Loading />;

  if (!isAllowed(["root", "coop_root", "admin"], data?.user))
    return <NotAllowed />;

  if (elections === undefined) return <NotFound></NotFound>;

  const candidates = elections.candidates.map(
    (candidate: TCandidatewithPosition) => ({
      ...candidate,
      eventId: params.id,
    }),
  );

  return (
    <div>
      <Header text="Manage Candidates"></Header>
      <CandidateTable
        params={params}
        positions={elections?.positions}
        data={candidates}
      ></CandidateTable>
    </div>
  );
};

export default page;
