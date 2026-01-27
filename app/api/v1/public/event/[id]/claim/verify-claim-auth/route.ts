import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { validateClaimAuth } from "../service";
import { ClaimAuthError } from "@/errors/claim-auth-error";
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdParamSchema } from "@/validation-schema/api-params"

type TParams = { params : { id : number } }

export const GET = async ( req : NextRequest, { params } : TParams) => {
    try{
        const { id } = eventIdParamSchema.parse(params);

        const { attendeeId, eventId, passbookNumber } = await validateClaimAuth(req, id);

        const member = await db.eventAttendees.findUnique({ where : {  id : attendeeId, eventId_passbookNumber : { eventId, passbookNumber } }})

        if(!member) 
            throw new ClaimAuthError("We could not find your record on our member list for this event.", 404)

        return NextResponse.json(member)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}