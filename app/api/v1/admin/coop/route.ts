import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { uploadFile } from "@/services/s3-upload";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { imageFileToUploadable } from "@/lib/server-utils";
import { createCoopSchema } from "@/validation-schema/coop";
import { routeErrorHandler } from "@/errors/route-error-handler";

export const GET = async (req: NextRequest) => {
    try {
        await currentUserOrThrowAuthError();

        const cooperatives = await db.coop.findMany({
            include: {
                branches: true,
            },
        });

        return NextResponse.json(cooperatives);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const currentUser = await currentUserOrThrowAuthError();
        const payload = await req.formData();

        const rawImage = payload.get("image") as any;
        const rawData = payload.get("data") as any;

        const data = createCoopSchema.parse(JSON.parse(rawData));

        let cooperative = await db.coop.create({
            data: {
                ...data,
                createdBy: currentUser.id,
                updatedBy: currentUser.id,
            },
            include : { branches : true }
        });

        const uploadable = await imageFileToUploadable({
            file: rawImage,
            fileName: `coop-${cooperative.id}`,
            folderGroup: "coop",
        });

        if (uploadable) {
            const uploadUrl = await uploadFile(...uploadable);

            cooperative = await db.coop.update({ 
                where : { id : cooperative.id }, 
                data : { coopLogo : uploadUrl },
                include : { branches : true }
            })
        }

        return NextResponse.json(cooperative);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
