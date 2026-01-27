import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdParamSchema } from "@/validation-schema/api-params"

type TParams = { params : { id : number }}

export const GET = async ( req : NextRequest, { params } : TParams ) =>{
    try{
        const { id } = eventIdParamSchema.parse(params)

        const election = await db.election.findUnique({
            where: { eventId: id, deleted : false },
            include: { event: true },
        });

        if(!election) return NextResponse.json({ message : "Election not found, or possibly this event doesn't have an election."}, { status : 404})
        
        return NextResponse.json(election)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}
