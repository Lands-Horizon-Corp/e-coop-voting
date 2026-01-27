import sharp from "sharp";
import QRCode from "qrcode";
import qs from "query-string";
import archiver from "archiver";
import { PassThrough } from "stream";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { uploadFile } from "@/services/s3-upload";
import { PB_QR_EXPORT_BATCH_SIZE } from "@/constants";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

import { TFolderUploadGroups } from "@/types";
import { eventPbBulkExportRequestSchema } from "@/types/qr-pb-bulk-export";

import { FUNCTION_DURATION } from "@/constants"

export const maxDuration = FUNCTION_DURATION;

type TParams = { params: { id: number } };

const generateQRWithTextPNG = async ({
    passbookNumber,
    dimension,
    showPbNumberText,
    fullName,
}: {
    passbookNumber: string;
    dimension: number;
    showPbNumberText: boolean;
    fullName?: string;
}) => {
    const qrBuffer = await QRCode.toBuffer(passbookNumber, {
        width: dimension,
        margin: 1,
    });

    if (!showPbNumberText) return qrBuffer;

    const lineHeight = 20;
    const textHeight = fullName ? lineHeight * 2 : lineHeight;
    const finalHeight = dimension + textHeight;

    const textOverlay = Buffer.from(
        `<svg width="${dimension}" height="${textHeight}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${dimension}" height="${textHeight}" fill="white"/>
            <text x="50%" y="${lineHeight / 2}" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="black">${passbookNumber}</text>
            ${
                fullName
                    ? `<text x="50%" y="${lineHeight * 1.5}" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="black">${fullName}</text>`
                    : ""
            }
        </svg>`
    );

    return sharp({
        create: {
            width: dimension,
            height: finalHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
    })
        .composite([
            { input: qrBuffer, top: 0, left: 0 },
            { input: textOverlay, top: dimension, left: 0 },
        ])
        .png({ compressionLevel: 9, quality: 80 })
        .toBuffer();
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = await eventIdParamSchema.parseAsync(params);
        const { query } = qs.parseUrl(req.url);

        const { batch, dimension, showPbNumberText } =
            await eventPbBulkExportRequestSchema.parseAsync(query);

        const passbookNumbers = await db.eventAttendees.findMany({
            where: { eventId },
            select: {
                firstName: true,
                middleName: true,
                lastName: true,
                passbookNumber: true,
            },
            orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
            take: PB_QR_EXPORT_BATCH_SIZE,
            skip: (batch - 1) * PB_QR_EXPORT_BATCH_SIZE,
        });

        const zipStream = new PassThrough();
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(zipStream);

        const qrPromises = passbookNumbers.map(
            ({ passbookNumber, firstName, lastName, middleName }) =>
                generateQRWithTextPNG({
                    passbookNumber,
                    dimension: dimension ?? 320,
                    showPbNumberText: showPbNumberText ?? false,
                    fullName: `${firstName} ${lastName} ${middleName}`,
                }).then((qrBuffer) => {
                    archive.append(qrBuffer, { name: `${passbookNumber}.png` });
                })
        );

        await Promise.all(qrPromises);
        await archive.finalize();

        const fileUrl = await uploadFile(
            zipStream,
            `Event_${params.id}_PB_QRCode_Batch_${batch}.zip`,
            "downloadables" as TFolderUploadGroups,
            "application/zip"
        );

        return NextResponse.json({ url: fileUrl });
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
