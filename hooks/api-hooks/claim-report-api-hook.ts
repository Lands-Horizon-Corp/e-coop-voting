import axios from "axios";
import qs from "query-string";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import { TIncentiveClaimReportsPerUser } from "@/types";

export const useClaimReports = (eventId: number, ids: number[]) => {
    const {
        data: reports,
        isLoading,
        isRefetching,
        refetch,
    } = useQuery<TIncentiveClaimReportsPerUser[], string>({
        queryKey: [`claim-report-query-${ids.join(",")}`],
        queryFn: async () => {
            try {
                const baseUrl = `/api/v1/admin/event/${eventId}/incentives/claim/reports`;

                const url =
                    ids.length > 0
                        ? qs.stringifyUrl({
                            url: baseUrl,
                            query: {
                                ids: ids.map((id) => id.toString()).join(","),
                            },
                        })
                        : baseUrl;

                const request = await axios.get(url);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: { label: "try again", onClick: () => refetch() },
                });
                throw e;
            }
        },
        initialData: [],
    });

    return { reports, isLoading, isRefetching, refetch };
};
