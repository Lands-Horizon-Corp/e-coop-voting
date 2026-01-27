"use client";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { getMembersQuorum } from "@/hooks/api-hooks/member-api-hook";
import { Sigma, UsersRound, Vote } from "lucide-react";
import React from "react";
import Loading from "../../_components/loading";
type TParams = {
   params: { id: number; electionId: number };
};
const QuorumSection = ({ params }: TParams) => {
   const { members, isLoading, isError } = getMembersQuorum(params.id);

   if(isLoading) return <Loading></Loading>

   if (!members) return null;
   
   
   const percentageAttendanceTotal =(Number(members?.totalIsRegistered) / Number(members?.totalAttendees)) *100;
   const percentageVotersTotal =(Number(members?.totalMembersVoted) / Number(members?.totalAttendees)) *100;
   
   const finalAttendanceTotal = percentageAttendanceTotal >= 1 ? Math.trunc(percentageAttendanceTotal) : percentageAttendanceTotal.toFixed(5)
   const finalVotersTotal =  percentageVotersTotal >= 1 ? Math.trunc(percentageVotersTotal) : percentageVotersTotal.toFixed(5)

   return (
      <div className="min-w-[200px] flex justify-start flex-col lg:justify-start  xl:flex-row   space-x-0 xl:space-x-10 p-5">
         <div className="min-w-fit ">
            <div className="flex space-x-2  items-center py-5">
               <div className="p-1 dark:bg-[#c5a522] bg-[#e7c127] rounded-sm">
                  <Sigma className="size-5 text-slate-200" />
               </div>
               <h1 className="font-medium">Quorum</h1>
            </div>
            <Card className="w-full lg:w-fit">
               <CardHeader>
                  <CardTitle>Total Attendance</CardTitle>
               </CardHeader>
               <CardContent>
                  <h1 className="font-bold text-[3rem] text-primary">
                     {isNaN(Number(finalAttendanceTotal)) ? 0 : finalAttendanceTotal}%
                  </h1>
                  <CardDescription className="text-md">
                     {members?.totalIsRegistered + " (Total registered)"}{" / "}{members?.totalAttendees + " members"}
                  </CardDescription>
               </CardContent>
            </Card>
         </div>
         <div className="min-w-fit ">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 dark:bg-[#226ec5] bg-[#2d84e8] rounded-sm">
                <UsersRound className="size-5 text-slate-200"/>
               </div>
               <h1 className="font-medium">Participants</h1>
            </div>
            <Card className="w-full lg:w-fit rounded-2xl">
               <CardHeader>
                  <CardTitle>Total Votes</CardTitle>
               </CardHeader>
               <CardContent>
                  <h1 className="font-bold text-[3rem] text-primary">
                  {isNaN(Number(finalVotersTotal)) ? 0 : finalVotersTotal}%
                  </h1>
                  <CardDescription className="text-md">
                     {members?.totalMembersVoted + "(Total voters)"}{" / "}{members?.totalAttendees + " members"}
                  </CardDescription>
               </CardContent>
            </Card>
         </div>
         <div className="min-w-fit ">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 bg-primary rounded-sm">
                <Vote className="size-5 text-slate-200"/>
               </div>
               <h1 className="font-medium">Voters</h1>
            </div>
            <Card className="w-full lg:w-[270px] rounded-2xl">
               <CardHeader>
                  <CardTitle>Vote Summary</CardTitle>
               </CardHeader>
               <CardContent>
                  <h1 className="font-bold text-[3rem] text-primary">
                    {members.totalMembersVoted}
                  </h1>
                  <CardDescription className="text-md">
                      voters
                  </CardDescription>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default QuorumSection;
