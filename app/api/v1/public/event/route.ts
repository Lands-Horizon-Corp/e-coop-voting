export const dynamic = "force-dynamic";

import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrFalse } from "@/lib/auth";
import { Event } from "@prisma/client";

export const GET = async (req: NextRequest) => {
    try {
        const currentUser = await currentUserOrFalse();
        let events: Event[] = [];

        if (currentUser) {
            events = await db.event.findMany({
                where: { deleted: false, branchId: currentUser.branchId },
                orderBy: [{ createdAt: "desc" }, { date: "desc" }],
            });
        } else {
            events = await db.event.findMany({
                where: { deleted: false },
                orderBy: [{ createdAt: "desc" }, { date: "desc" }],
            });
        }

        return NextResponse.json(events);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
