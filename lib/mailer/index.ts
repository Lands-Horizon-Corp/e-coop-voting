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
      "utf8",
    );
    templateCache.set(templateFile, handlebars.compile(templateContent));
  }
  return templateCache.get(templateFile)!(payload);
};

const CHUNK_SIZE = 100;

const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize),
  );
};

type TEmail = "mailchip" | "resender";
export const mails = async (
  sendMailsContent: ISendMailRawProps[],
  email: TEmail = "mailchip",
): Promise<TMailSendObject> => {
  if (email === "mailchip") {
    return sendMail(sendMailsContent, new MailchimpMailer());
  }
  return sendMail(sendMailsContent, new MailchimpMailer());
};

export const sendMail = async (
  sendMailsContent: ISendMailRawProps[],
  mailer: IMailer,
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const sendMailBatched = async (
  sendMailsContent: ISendMailRawProps[],
  mailer: IMailer,
): Promise<TMailSendObject> => {
  let successSend: { success: true; to: string }[] = [];
  let errorSend: { success: false; to: string; reason: string }[] = [];
  const emailChunks = chunkArray(sendMailsContent, CHUNK_SIZE);
  const CHUNKS_PER_SECOND = 4;
  const DELAY_MS = 1100;
  for (let i = 0; i < emailChunks.length; i++) {
    const chunk = emailChunks[i];
    try {
      const prepTasks = chunk.map(async (mailContent) => {
        const content = await getEmailTemplate(mailContent.mailTemplate);
        return {
          to: mailContent.to,
          subject: mailContent.subject,
          content,
        } as IFinalSendMail;
      });
      const preparedBatch = await Promise.all(prepTasks);
      const batchResult = await mailer.sendBatch(preparedBatch, FROM_EMAIL);
      successSend.push(...batchResult.successSend);
      errorSend.push(...batchResult.errorSend);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const failedEmails = chunk.map((mail) => mail.to).join(", ");
      errorSend.push({
        success: false,
        to: failedEmails || "batch_unknown",
        reason: errorMessage,
      });
    }
    if ((i + 1) % CHUNKS_PER_SECOND === 0 && i < emailChunks.length - 1) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `Rate limit threshold reached. Sleeping for ${DELAY_MS}ms...`,
        );
      }
      await sleep(DELAY_MS);
    }
  }
  if (process.env.NODE_ENV === "development") {
    console.log("Batched Mail Task Complete:", {
      totalSuccess: successSend.length,
      totalErrors: errorSend.length,
    });
  }

  return { successSend, errorSend };
};
