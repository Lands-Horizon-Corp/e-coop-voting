import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params : { id : number }}

export const GET = async ( req : NextRequest , { params } : TParams ) => {
    try{
        const { id } = eventIdParamSchema.parse(params)

        const event = await db.event.findUnique({ 
            where : {
                id,
                deleted : false
            },
            include : {
                election : true
            }
        })

        if(!event) return NextResponse.json({ message : "Event not found"}, { status : 404 })

        return NextResponse.json(event)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}