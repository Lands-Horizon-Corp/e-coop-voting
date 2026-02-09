import path from "path";
import { promises as fs } from "fs";
import * as handlebars from "handlebars";

const FROM_EMAIL = process.env.EMAIL_SENDER!;

import {
    IMailer,
    TMailTemplate,
    IFinalSendMail,
    TMailSendObject,
    ISendMailRawProps,
} from "@/types";
import { MailchimpMailer } from "./mailchimp";

const templateCache = new Map<string, handlebars.TemplateDelegate>();

const getEmailTemplate = async ({ templateFile, payload }: TMailTemplate) => {
    if (!templateCache.has(templateFile)) {
        const templateContent = await fs.readFile(
            path.join(process.cwd(), "public", "email-templates", templateFile),
            "utf8"
        );
        templateCache.set(templateFile, handlebars.compile(templateContent));
    }
    return templateCache.get(templateFile)!(payload);
};

const CHUNK_SIZE = 500;

const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
        arr.slice(i * chunkSize, i * chunkSize + chunkSize)
    );
};

type TEmail ='mailchip' | 'resender'
export const mails = async (sendMailsContent: ISendMailRawProps[], email: TEmail= 'mailchip'): Promise<TMailSendObject>  => {
    if(email === 'mailchip'){
        return sendMail(sendMailsContent, new MailchimpMailer())
    }
    return sendMail(sendMailsContent, new MailchimpMailer())
}


export const sendMail = async (
    sendMailsContent: ISendMailRawProps[],
    mailer: IMailer
): Promise<TMailSendObject> => {
    let successSend: { success: true; to: string }[] = [];
    let errorSend: { success: false; to: string; reason: string }[] = [];

    const emailChunks = chunkArray(sendMailsContent, CHUNK_SIZE);

    for (const chunk of emailChunks) {
        const emailTasks = chunk.map(async (mailContent) => {
            const content = await getEmailTemplate(mailContent.mailTemplate);
            const preparedMail: IFinalSendMail = {
                to: mailContent.to,
                subject: mailContent.subject,
                content,
            };

            return mailer.sendMail(preparedMail, FROM_EMAIL);
        });

        const results = await Promise.allSettled(emailTasks);

        results.forEach((res) => {
            if (res.status === "fulfilled") {
                successSend.push(...res.value.successSend);
                errorSend.push(...res.value.errorSend);
            } else {
                errorSend.push({
                    success: false,
                    to: "unknown",
                    reason:
                        res.reason instanceof Error
                            ? res.reason.message
                            : String(res.reason),
                });
            }
        });
    }

    if (process.env.NODE_ENV === "development")
        console.log("Mail Task:", { successSend, errorSend });
    return { successSend, errorSend };
};
