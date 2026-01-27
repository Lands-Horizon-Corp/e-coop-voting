import { routeErrorHandler } from "@/errors/route-error-handler"
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"
import { validateId } from "@/lib/server-utils"
type TParams = {
     params:{id:number}
   }
   
export const GET =async (req:NextRequest,{params}:TParams)=>{
     try {
          const eventId = Number(params.id)
          validateId(eventId)
          const getMembersRegistered = await db.eventAttendees.findMany({
               where:{
                    AND:{eventId:eventId,registered:true},
               }
          })  
          
          const getMembersVoted = await db.eventAttendees.findMany({
               where:{
                    AND:{eventId:eventId,voted:true},
               }
          })   
          
          const getMembers = await db.eventAttendees.findMany({
               where:{
                    eventId:eventId,
               }
          })   
          const getQuorum = {
               totalAttendees:getMembers.length,
               totalIsRegistered:getMembersRegistered.length,
               totalMembersVoted:getMembersVoted.length
           };

          return NextResponse.json(getQuorum)
       } catch (error) {
          return routeErrorHandler(error, req);
       }
   }
   