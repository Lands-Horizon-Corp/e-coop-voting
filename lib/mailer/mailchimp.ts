import mailchimp, {
    RejectReason,
    MessagesMessage,
} from "@mailchimp/mailchimp_transactional";

import { IFinalSendMail, IMailer, TMailSendObject } from "@/types";

const API_KEY = process.env.MAILCHIMP_API_KEY!;

export class MailchimpMailer implements IMailer {
    private client: mailchimp.ApiClient;

    constructor() {
        this.client = mailchimp(API_KEY);
    }

    translateReason(rejectReason: RejectReason) {
        switch (rejectReason) {
            case "hard-bounce":
                return "Invalid email address or the email does not exist";
            case "soft-bounce":
                return "Recipient's email mailbox possibly full";
            default:
                return "Unknown error sending email";
        }
    }

    async sendMail(
        sendMailsContent: IFinalSendMail,
        fromEmail: string
    ): Promise<TMailSendObject> {
        const { subject, to, content } = sendMailsContent;

        const message: MessagesMessage = {
            from_email: fromEmail,
            to: [{ email: to }],
            subject,
            html: content,
        };

        try {
            const sendMailResponse = await this.client.messages.send({
                message,
            });
            const mailStatus = Array.isArray(sendMailResponse)
                ? sendMailResponse[0]
                : sendMailResponse;

            if (
                mailStatus.status === "sent" ||
                mailStatus.status === "queued" ||
                mailStatus.status === "scheduled"
            ) {
                return {
                    successSend: [{ success: true, to: mailStatus.email }],
                    errorSend: [],
                };
            } else {
                return {
                    successSend: [],
                    errorSend: [
                        {
                            success: false,
                            to,
                            reason:
                                mailStatus.status?.toString() ??
                                "Unknown Error",
                            reasonDescription:
                                mailStatus.status === "rejected"
                                    ? this.translateReason(
                                          mailStatus.reject_reason as RejectReason
                                      )
                                    : "Unknown reason",
                        },
                    ],
                };
            }
        } catch (error: any) {
            console.error(
                "[Mailchimp Error] Error sending email:",
                error.message
            );

            return {
                successSend: [],
                errorSend: [
                    {
                        success: false,
                        to,
                        reason: error.message || "Unknown Mailchimp error",
                        reasonDescription: "unknown reason",
                    },
                ],
            };
        }
    }
}
