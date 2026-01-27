"use client";
import { getReportsResults } from "@/hooks/api-hooks/vote-api-hooks";
import React, { useRef } from "react";
import Loading from "../../_components/loading";
import NotFound from "../../_components/not-found";

import NoVoters from "../_components/no-voters";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { GrRotateRight } from "react-icons/gr";
import { cn, tableToExcel } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TParams = {
  params: { id: number; electionId: number };
  electionName: string;
};
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ElectionReports = ({ params, electionName }: TParams) => {
  const tableRef = useRef(null);

  const { votes, isLoading, refetch, isRefetching } = getReportsResults(params);

  if (isLoading) return <Loading></Loading>;
  if (!votes) return <NotFound></NotFound>;
  if (votes.sum === 0) return <NoVoters></NoVoters>;

  const exportToExcel = () => {
    if (tableRef.current) {
      tableToExcel(tableRef.current, `${electionName}_reports`);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-x-2 p-2">
        <div className="flex w-full justify-between items-center">
          <h1 className="font-bold">{electionName}</h1>
          <p className="text-muted-foreground font-normal">
            Total Votes:{" "}
            <span className=" text-primary font-bold">
              {" "}
              {votes.total.reduce((acc, curr) => acc + curr, 0)}
            </span>
          </p>
        </div>
        <Button
          disabled={isRefetching}
          variant={"secondary"}
          onClick={() => refetch()}
          className="gap-x-2"
          size="icon"
        >
          <GrRotateRight
            className={`size-4 ${isRefetching ? "animate-spin" : "animate-none"}`}
          />
        </Button>
        <Button
          disabled={isRefetching}
          className="gap-x-2"
          onClick={() => {
            exportToExcel();
          }}
        >
          <PiMicrosoftExcelLogoFill className="size-4" /> Export
        </Button>
      </div>
      <Separator />
      <div className=" h-fit lg:w-full">
        <Table
          className=" bg-transparent hover:bg-transparent border-0  "
          ref={tableRef}
        >
          <TableHeader className="">
            <TableRow className="hover:bg-transparent border-0">
              <TableCell colSpan={1} className="" />
              <TableCell
                colSpan={votes.candidates.length}
                className="text-center font-semibold uppercase "
              >
                candidates
              </TableCell>
            </TableRow>

            <TableRow className="bg-secondary hover:bg-secondary border-0">
              <TableCell className="w-[30%] min-w-[300px] text-center font-bold uppercase text-muted-foreground">
                Voters
              </TableCell>
              {votes?.candidates?.map((candidate) => {
                return (
                  <TableCell
                    key={candidate.candidateId}
                    className="text-[13px] w-24 text-white font-medium cursor-pointer overflow-auto"
                  >
                    <Popover>
                      <PopoverTrigger>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p>
                                {" "}
                                <Avatar>
                                  <AvatarImage
                                    src={candidate.picture}
                                    alt={candidate.firstName}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                              </p>
                            </TooltipTrigger>

                            <TooltipContent>
                              <div className="flex items-center gap-2">
                                <Avatar>
                                  <AvatarImage
                                    src={candidate.picture}
                                    alt={candidate.firstName}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className=" text-start">
                                  <p>
                                    {" "}
                                    {candidate.firstName} {candidate.lastName}
                                  </p>
                                  <p> {candidate.position}</p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage
                              src={candidate.picture}
                              alt={candidate.firstName}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p>
                            {" "}
                            {candidate.firstName} {candidate.lastName}
                            <br></br>
                            <span className=" text-muted-foreground">
                              {" "}
                              {candidate.position}
                            </span>
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="max-h-[50vh] overflow-auto border">
          <Table
            className=" bg-transparent hover:bg-transparent max-h-[50vh] overflow-auto "
            ref={tableRef}
          >
            <TableBody className="border">
              {votes?.voters.map((voter) => {
                return (
                  <TableRow key={voter.id} className="" >
                    <TableCell className={cn(" w-[30%] !min-w-[300px] overflow-auto bg-secondary/50")}>
                      {voter.voterName}
                    </TableCell>
                    {voter.votes.map((vote, idx) => {
                      return (
                        <TableCell
                          className="text-muted-foreground font-bold w-[5.8rem]"
                          key={idx}
                        >
                          {vote === 0 ? "" : vote}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Table>
          <TableFooter>
            <TableRow className="bg-secondary ">
              <TableCell className={cn("font-bold w-[30%] min-w-[300px] bg-primary overflow-auto")}>
                Total
              </TableCell>
              {votes?.total.map((total, idx) => {
                return (
                  <TableCell className="font-bold w-[5.98rem]" key={idx}>
                    {" "}
                    {total}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
};

export default ElectionReports;
