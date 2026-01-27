import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventAndIncentiveParamSchema } from "@/validation-schema/api-params";
import { createIncentiveAssigneeSchema } from "@/validation-schema/incentive";
import { Prisma } from "@prisma/client";

type TParams = { params: { id: number; incentiveId: number } };

// all asignee for this specific incentive
// export const GET = async (req: NextRequest, { params }: TParams) => {
//     try{
//         const { id : eventId, incentiveId } = eventAndIncentiveParamSchema.parse(params)
//         const currentUser = await currentUserOrThrowAuthError();

//         const incentiveAssigned = await db.incentiveAssigned.findMany({
//             where : {
//                 eventId,
//                 userId : currentUser.id,
//                 incentiveId
//             }
//         })

//         return NextResponse.json(incentiveAssigned)
//     }catch(e){
//         return routeErrorHandler(e, req)
//     }
// }

// assign user to incentive
export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId, incentiveId } =
            eventAndIncentiveParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();
        const data = createIncentiveAssigneeSchema.parse(await req.json());

        const createAssign = await db.incentives.update({
            where: { id: incentiveId },
            data: {
                assigned: {
                    create: {
                        eventId,
                        ...data,
                        createdBy: currentUser.id,
                    },
                },
                event: {
                    update: {
                        subUpdatedAt: new Date(),
                    },
                },
            },
        });

        return NextResponse.json(createAssign);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002")
                return NextResponse.json(
                    {
                        message:
                            "This user is already assigned to this incentive",
                    },
                    { status: 409 }
                );
        }
        return routeErrorHandler(e, req);
    }
};
