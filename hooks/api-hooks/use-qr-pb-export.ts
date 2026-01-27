import axios from "axios";
import qs from "query-string";
import { useQuery } from "@tanstack/react-query";

import {
    IEventPbBulkExportRequest,
    IEventPbBulkExportResponse,
} from "@/types/qr-pb-bulk-export";
import { IQueryHook } from "./types";
import { handleAxiosErrorMessage } from "@/utils";

export const useEventQrPbExport = ({
    enable,
    eventId,
    batch,
    dimension,
    showPbNumberText,
    onError,
    onSuccess,
}: {
    eventId: number;
} & IEventPbBulkExportRequest &
    IQueryHook<IEventPbBulkExportResponse | undefined, string>) => {
    return useQuery<IEventPbBulkExportResponse | undefined, string>({
        queryKey: ["qr-bulk-download", eventId, batch],
        queryFn: async () => {
            try {
                const url = qs.stringifyUrl(
                    {
                        url: `/api/v1/admin/event/${eventId}/member/qr-bulk-export`,
                        query: {
                            batch,
                            dimension,
                            showPbNumberText
                        },
                    },
                    { skipNull: true }
                );

                const qrBulkDownloadUrl: IEventPbBulkExportResponse = await (
                    await axios.get(url)
                ).data;

                onSuccess?.(qrBulkDownloadUrl);

                return qrBulkDownloadUrl;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                onError?.(errorMessage);
                return undefined;
            }
        },
        enabled: enable,
    });
};
