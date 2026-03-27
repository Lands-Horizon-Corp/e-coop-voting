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
    fromEmail: string,
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
            reasonDescription: err?.message || "Unknown Resend error",
          },
        ],
      };
    }
  }

  sendBatch = async (
    batchContent: IFinalSendMail[],
    fromEmail: string,
  ): Promise<TMailSendObject> => {
    try {
      const payload = batchContent.map((mail) => ({
        from: fromEmail,
        to: [mail.to],
        subject: mail.subject,
        html: mail.content,
      }));

      const response = await this.client.batch.send(payload);
      if (response.error || !response.data) {
        throw response.error || new Error("No data returned");
      }
      const result: TMailSendObject = {
        successSend: [],
        errorSend: [],
      };
      const batchResults = response.data.data as any[];
      batchResults.forEach((item, index) => {
        const originalTo = batchContent[index].to;
        if (item.error) {
          result.errorSend.push({
            success: false,
            to: originalTo,
            reason: item.error.name || "resend_batch_item_error",
            reasonDescription: item.error.message,
          });
        } else {
          result.successSend.push({
            success: true,
            to: originalTo,
          });
        }
      });

      return result;
    } catch (err: any) {
      console.error("[ResendMailer Batch]", err);
      // This catch handles global network errors or API authentication failures
      return {
        successSend: [],
        errorSend: batchContent.map((mail) => ({
          success: false,
          to: mail.to,
          reason: err?.name || "batch_request_failed",
          reasonDescription: err?.message || "The entire batch request failed",
        })),
      };
    }
  };
}
