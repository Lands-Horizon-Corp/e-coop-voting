import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { eventIdParamSchema } from "@/validation-schema/api-params"
import { routeErrorHandler } from "@/errors/route-error-handler"

type TParams = { params : { id : number }}

export const GET = async( req : NextRequest, { params } : TParams) => {
    try{
        const { id } = eventIdParamSchema.parse(params)

        const election = await db.election.findUnique({
            where: { eventId: id },
            include: {
                event: true,
                positions: {
                    include: { candidates: { include: { position: true } } },
                    orderBy : { id : "asc" }
                },
            },
        });

        if(!election) return NextResponse.json({ message : "Election not found"}, { status : 404 })

        return NextResponse.json(election)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}
