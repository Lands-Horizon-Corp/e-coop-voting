import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"
import { currentUserOrThrowAuthError } from "@/lib/auth"

import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdSchema } from "@/validation-schema/commons"

type TParams = { params : { id : number }}

export const GET = async (req : NextRequest, { params } : TParams) => {
    try{
        const eventId = eventIdSchema.parse(params.id)
        const currentUser = await currentUserOrThrowAuthError();

        const assignedIncentives = await db.incentiveAssigned.findMany({
            select : {
                id : true,
                eventId : true,
                incentiveId : true,
                incentive : {
                    select : {
                        id : true,
                        itemName : true,
                        eventId : true,
                        claimRequirement : true
                    }
                }
            },
            where : {
                eventId,
                userId : currentUser.id
            }
        })

        return NextResponse.json(assignedIncentives)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}