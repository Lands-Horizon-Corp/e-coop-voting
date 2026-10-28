"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";
import VoteCopyReceipt from "@/components/vote-copy-receipt";
import { handleAxiosErrorMessage } from "@/utils";
import { TVoteCopyB64 } from "@/types";
import { TEvent } from "@/types";

type TVoteCopyData = {
  event: Pick<TEvent, "id" | "title" | "date" | "location">;
  electionId: number;
  fullName: string;
  passbookNumber: string;
  votes: TVoteCopyB64[];
};

const VoteCopyModalContent = ({
  eventId,
  memberId,
}: {
  eventId: number;
  memberId: string;
}) => {
  const { data, isPending, error } = useQuery<TVoteCopyData, string>({
    queryKey: ["member-vote-copy", eventId, memberId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/v1/admin/event/${eventId}/member/${memberId}/vote-copy`,
        );
        return response.data;
      } catch (requestError) {
        throw handleAxiosErrorMessage(requestError);
      }
    },
  });

  if (isPending) return <LoadingSpinner className="mx-auto my-8" />;
  if (error) return <InvalidPrompt message={error} />;
  if (!data) return <InvalidPrompt message="Vote copy could not be loaded." />;

  return (
    <div className="max-h-[65vh] overflow-y-auto">
      <VoteCopyReceipt {...data} />
    </div>
  );
};

export default VoteCopyModalContent;
