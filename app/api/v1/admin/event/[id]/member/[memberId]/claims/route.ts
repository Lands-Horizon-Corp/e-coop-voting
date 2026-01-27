import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdandMemberIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params : { id : number, memberId : string }}

export const GET = async (req : NextRequest, { params } : TParams) => {
    try{
        await currentUserOrThrowAuthError();
        const { id : eventId, memberId } = eventIdandMemberIdParamSchema.parse(params);

        const memberClaimsWithAssistanceUser = await db.incentiveClaims.findMany({
            where : {
                eventId,
                eventAttendeeId : memberId
            },
            include : {
                assigned : {
                    include : {
                        user : {
                            select : {
                                id : true,
                                picture : true,
                                name : true,
                                email : true,
                            }
                        }
                    }
                },
                incentive : true
            }
        })

        return NextResponse.json(memberClaimsWithAssistanceUser)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}