export const dynamic = 'force-dynamic'

import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";

export const GET = async ( req : NextRequest ) => {
    try{
        const events = await db.event.findMany({
            where: { deleted: false },
            orderBy: [ { createdAt: "desc"} , {date : "desc" } ]
        })

        return NextResponse.json(events)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}