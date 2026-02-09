import { Resend } from "resend";
import { IMailer, IFinalSendMail, TMailSendObject } from "@/types";

const API_KEY = process.env.RESEND_API_KEY!;

export class ResendMailer implements IMailer {
    private client: Resend;

    constructor() {
        this.client = new Resend(API_KEY);
    }

    async sendMail(
        sendMailsContent: IFinalSendMail,
        fromEmail: string
    ): Promise<TMailSendObject> {
        const { subject, to, content } = sendMailsContent;

        try {
            const { error } = await this.client.emails.send({
                from: fromEmail,
                to: [to],
                subject,
                html: content,
            });

            if (error) {
                return {
                    successSend: [],
                    errorSend: [
                        {
                            success: false,
                            to,
                            reason: error.name || "resend_error",
                            reasonDescription: error.message,
                        },
                    ],
                };
            }

            return {
                successSend: [{ success: true, to }],
                errorSend: [],
            };
        } catch (err: any) {
            console.error("[ResendMailer]", err);

            return {
                successSend: [],
                errorSend: [
                    {
                        success: false,
                        to,
                        reason: err?.name || "unknown_resend_error",
                        reasonDescription:
                            err?.message || "Unknown Resend error",
                    },
                ],
            };
        }
    }
}
