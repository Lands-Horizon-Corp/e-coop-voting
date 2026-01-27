import { uploadFile } from "@/services/s3-upload";
import { NextRequest, NextResponse } from "next/server";
import { uploadSchema } from "@/validation-schema/upload";
import { routeErrorHandler } from "@/errors/route-error-handler";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();

        const formDataObj: any = {};
        formData.forEach((value, key) => (formDataObj[key] = value));
        const { file, fileName, folderGroup } = uploadSchema.parse(formDataObj);

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFile(buffer, `${fileName}`, folderGroup);

        return NextResponse.json(url);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
