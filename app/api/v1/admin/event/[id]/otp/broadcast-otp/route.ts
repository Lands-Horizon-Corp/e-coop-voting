import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/mailer";
import { ISendMailRawProps, TMailErrorSend } from "@/types";
import { MailchimpMailer } from "@/lib/mailer/mailchimp";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import { memberEmailSchema } from "@/validation-schema/member";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { FUNCTION_DURATION } from "@/constants";

type TParams = { params: { id: number } };

export const maxDuration = FUNCTION_DURATION;

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);

        const event = await db.event.findUnique({ where: { id: eventId } });

        if (!event)
            return NextResponse.json(
                { message: "Event was not found" },
                { status: 404 }
            );

        const memberAttendeesList = await db.eventAttendees.findMany({
            select: {
                firstName: true,
                lastName: true,
                emailAddress: true,
                voteOtp: true,
            },
            where: {
                eventId: eventId,
                AND: [
                    { emailAddress: { not: null } },
                    { emailAddress: { not: "" } },
                ],
            },
        });

        if (memberAttendeesList.length === 0)
            return NextResponse.json(
                {
                    message:
                        "Nothing to send to, make sure they are allowed to vote and have a valid email address.",
                },
                { status: 400 }
            );

        const mails: ISendMailRawProps[] = [];

        const invalidMails: TMailErrorSend[] = [];

        memberAttendeesList.forEach((member) => {
            const validatedEmail = memberEmailSchema.safeParse(
                member.emailAddress
            );

            if (!validatedEmail.success)
                return invalidMails.push({
                    to: member.emailAddress ?? "",
                    reason: "Invalid Email",
                    success: false,
                    reasonDescription: "Member email is invalid",
                });

            mails.push({
                subject: "eCoop : Your event OTP",
                to: validatedEmail.data,
                mailTemplate: {
                    templateFile: "vote-otp.html",
                    payload: {
                        iconImage: `${process.env.DEPLOYMENT_URL}/images/vote-otp.png`,
                        eventTitle: event.title,
                        otp: member.voteOtp as "",
                        eventLink: `${process.env.DEPLOYMENT_URL}/events/${event.id}/`,
                        memberName: `${member.firstName} ${member.lastName}`,
                        eventCoverImage: event.coverImage as "",
                        ecoopLogo: `${process.env.DEPLOYMENT_URL}/images/coop-logo.png`,
                    },
                },
            });
        });

        const { errorSend, successSend } = await sendMail(
            mails,
            new MailchimpMailer()
        );

        await db.eventAttendees.updateMany({
            where: {
                emailAddress: {
                    in: successSend.map((sendEntry) => sendEntry.to),
                },
                eventId,
            },
            data: {
                otpSent: new Date(),
            },
        });

        return NextResponse.json({
            successSend,
            errorSend: [...invalidMails, ...errorSend],
        });
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
