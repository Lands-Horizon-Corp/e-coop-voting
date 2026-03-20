import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { TMemberAttendeesWithRegistrationAssistance } from "@/types/member-attendees.types";

export type SearchResult = TMemberAttendeesWithRegistrationAssistance;
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
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);
  const searchTrigger = debouncedQuery.trim();
  const isSearchReady = enabled && searchTrigger.length >= 3;

  return useQuery({
    queryKey: ["member-search", eventId, debouncedQuery, limit],
    queryFn: async ({ signal }): Promise<SearchResponse> => {
      if (!searchTrigger) {
        return {
          data: [],
          meta: { total: 0, limit, count: 0, query: "" },
        };
      }
      const params = new URLSearchParams({
        q: searchTrigger,
        limit: String(limit),
      });
      const response = await fetch(
        `/api/v1/admin/event/${eventId}/search?${params.toString()}`,
        { signal },
      );
      if (!response.ok) throw new Error("Search failed");
      return (await response.json()) as SearchResponse;
    },
    enabled: isSearchReady,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}
