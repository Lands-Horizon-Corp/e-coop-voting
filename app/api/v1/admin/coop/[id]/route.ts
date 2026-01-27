import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { uploadFile } from "@/services/s3-upload";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { imageFileToUploadable } from "@/lib/server-utils";
import { updateCoopSchema } from "@/validation-schema/coop";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { coopIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = coopIdParamSchema.parse(params);
        const payload = await req.formData();
        const currentUser = await currentUserOrThrowAuthError();

        const rawImage = payload.get("image") as any;
        const rawData = payload.get("data") as any;

        const data = updateCoopSchema.parse(JSON.parse(rawData));

        const uploadable = await imageFileToUploadable({
            file: rawImage,
            fileName: `coop-${id}`,
            folderGroup: "coop",
        });

        if (uploadable) data.coopLogo = await uploadFile(...uploadable);

        const updatedCoop = await db.coop.update({
            where: { id },
            data: { ...data, updatedBy: currentUser.id },
        });

        return NextResponse.json(updatedCoop);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = coopIdParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();

        const toDeleteCoop = await db.coop.findUnique({
            where: { id, users: { some : { OR : [{role: "root"}, { id : currentUser.id }] } } },
        });

        if(toDeleteCoop) return NextResponse.json({ message : "You cannot delete this coop as your account or a root user belongs to this coop" }, { status : 403 });

        await db.coop.delete({ where: { id } });

        return NextResponse.json("coop deleted");
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
