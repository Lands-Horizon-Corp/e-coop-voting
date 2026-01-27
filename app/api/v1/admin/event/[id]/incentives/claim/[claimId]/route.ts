import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { currentUserOrThrowAuthError } from "@/lib/auth"
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdAndClaimIdParamSchema } from "@/validation-schema/api-params"
import { claimReleaseSchema } from "@/validation-schema/incentive"

type TParams = { params : { id : number, claimId : number }}

export const DELETE = async ( req : NextRequest , { params } : TParams) => {
    try{
        await currentUserOrThrowAuthError();
        const { id : eventId, claimId } = eventIdAndClaimIdParamSchema.parse(params);

        const deletedClaim = await db.incentiveClaims.delete({
            where : {
                eventId,
                id : claimId
            }
        })



        return NextResponse.json(deletedClaim)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}

// for releasing of claims that is claimed online
export const PATCH = async ( req : NextRequest , { params } : TParams ) => {
    try{
        const currentUser = await currentUserOrThrowAuthError();
        const { id : eventId, claimId } = eventIdAndClaimIdParamSchema.parse(params);
        const { incentiveItemId } = claimReleaseSchema.parse(await req.json())

        const assignedItem = await db.incentiveAssigned.findUnique({ 
            where : {
                userId_incentiveId : {
                    userId : currentUser.id,
                    incentiveId : incentiveItemId
                }
            }
        })

        if(!assignedItem) 
            return NextResponse.json({ message : "Sorry, you cannot release this because you are not assigned for this incentive."}, { status : 403 })

        const updatedClaimEntry = await db.incentiveClaims.update({
            where : {
                id : claimId, 
                eventId
            },
            data : {
                assignedId : assignedItem.id,
                releasedAt : new Date(),
                assistedById : currentUser.id
            }
        })

        return NextResponse.json(updatedClaimEntry)
    }catch(e){
        return routeErrorHandler(e, req);
    }
}
