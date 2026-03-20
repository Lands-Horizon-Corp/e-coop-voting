import { useQuery } from "@tanstack/react-query";

export interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  passbookNumber: string;
  email?: string;
  picture?: string;
  [key: string]: any;
}

export interface SearchResponse {
  data: SearchResult[];
  meta: {
    total: number;
    limit: number;
    count: number;
    query: string;
  };
}

interface UseSearchOptions {
  eventId: number;
  query: string;
  limit?: number;
  enabled?: boolean;
}

export function useMemberSearch({
  eventId,
  query,
  limit = 20,
  enabled = true,
}: UseSearchOptions) {
  return useQuery({
    queryKey: ["member-search", eventId, query, limit],
    queryFn: async ({ signal }) => {
      if (!query.trim())
        return { data: [], meta: { total: 0, limit, count: 0, query: "" } };

      const params = new URLSearchParams({ q: query, limit: String(limit) });
      const response = await fetch(
        `/api/v1/admin/event/${eventId}/search?${params.toString()}`,
        {
          signal,
        },
      );

      if (!response.ok) throw new Error("Search failed");
      return (await response.json()) as SearchResponse;
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 60,
  });
}
