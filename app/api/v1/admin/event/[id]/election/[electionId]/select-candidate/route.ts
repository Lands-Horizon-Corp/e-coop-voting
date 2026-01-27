import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number,electionId:number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id)
        const electionId = eventIdSchema.parse(params.electionId)
        const eventAttendees = await db.eventAttendees.findMany({
            where: { eventId },
            include : { event : {
                select : {
                    election : {
                        select : { 
                            id : true
                        }
                    }
                }
            } },
            orderBy: [ { createdAt: "desc"} , {updatedAt : "desc" } ]
        });

        const getCandidate = await db.candidate.findMany({
          where:{
             electionId:electionId
             }
          })
         const filteredEventAttendees = eventAttendees.filter((attendee) => {
            return !getCandidate.find((candidate) => candidate.passbookNumber === attendee.passbookNumber);
        }); 

          return NextResponse.json(filteredEventAttendees);
    
    } catch (e) {
        routeErrorHandler(e, req);
    }
};
