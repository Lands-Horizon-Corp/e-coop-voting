import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { generateUserProfileS3URL } from "@/lib/aws-s3";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { generateOTP, validateId } from "@/lib/server-utils";

import { eventIdSchema } from "@/validation-schema/commons";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { FUNCTION_DURATION } from "@/constants"

export const maxDuration = FUNCTION_DURATION;

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id);

        const eventAttendees = await db.eventAttendees.findMany({
            where: { eventId },
            include: {
                event: {
                    select: {
                        election: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
        });
        return NextResponse.json(eventAttendees);
    } catch (e) {
        routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const data = await req.json();
        const user = await currentUserOrThrowAuthError();

        const eventId = await eventIdSchema.parseAsync(params.id);

        const memberData = {
            ...data,
            createdBy: user.id,
            voteOtp: generateOTP(6),
            picture:
                data.picture && data.picture.startsWith("https://")
                    ? data.picture
                    : generateUserProfileS3URL(
                          data.passbookNumber.toUpperCase()
                      ),
        };

        createMemberWithUploadSchema.parse(memberData);

        const newMember = await db.eventAttendees.create({ data: memberData });

        await db.event.update({
            where: { id: eventId },
            data: { subUpdatedAt: new Date() },
        });

        return NextResponse.json(newMember);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

const chunkMemberData = (
    array: {
        where: {
            eventId_passbookNumber: { eventId: number; passbookNumber: string };
        };
        data: { picture: string };
    }[],
    size: number
) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

export const PATCH = async (
    req: NextRequest,
    { params }: { params: { id: number } }
) => {
    try {
        const startTime = performance.now();

        const id = Number(params.id);
        validateId(id);
        const user = await currentUserOrThrowAuthError();

        const missingPictureMembers = await db.eventAttendees.findMany({
            where: {
                eventId: id,
                OR: [
                    { picture: null },
                    { picture: "" },
                    { picture: { not: { startsWith: "https://" } } },
                ],
            },
            select: { passbookNumber: true, eventId: true, picture: true },
        });

        if (missingPictureMembers.length === 0) {
            return NextResponse.json({
                message:
                    "All members' pictures are synced to the database. No updates were made.",
            });
        }

        console.log(
            `Found ${missingPictureMembers.length} members without pictures`
        );

        const updates = missingPictureMembers.map((member) => ({
            where: {
                eventId_passbookNumber: {
                    eventId: member.eventId,
                    passbookNumber: member.passbookNumber.toUpperCase(),
                },
            },
            data: {
                picture: generateUserProfileS3URL(
                    member.passbookNumber.toUpperCase()
                ),
            },
        }));

        const BATCH_SIZE = 100;
        const batches = chunkMemberData(updates, BATCH_SIZE);

        console.log(
            `Processing ${updates.length} members in ${batches.length} batches`
        );

        const batchPromises = batches.map((batch) =>
            db.$transaction(
                batch.map((update) => db.eventAttendees.update(update))
            )
        );

        const results = await Promise.allSettled(batchPromises);

        const successfulUpdates = results
            .filter((res) => res.status === "fulfilled")
            .map((res) => (res as PromiseFulfilledResult<any>).value)
            .flat();

        const endTime = performance.now();
        console.log(`Execution Time: ${(endTime - startTime) / 1000} seconds`);

        return NextResponse.json({
            updatedMembers: successfulUpdates.slice(0, 5),
            totalUpdated: successfulUpdates.length,
            message: `Updated ${successfulUpdates.length} members pictures.`,
        });
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
