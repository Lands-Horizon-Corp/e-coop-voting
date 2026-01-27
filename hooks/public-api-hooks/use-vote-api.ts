import z from "zod";
import qs from "query-string";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import { TElection, TMemberAttendeesMinimalInfo } from "@/types";
import { chosenCandidateIds } from "@/validation-schema/election";
import { voterVerificationFormSchema } from "@/validation-schema/event-registration-voting";

export const loadVoter = (election: TElection) => {
    const { data: voter, isPending, isError, error, } = useQuery<TMemberAttendeesMinimalInfo, string>({
        queryKey: ["voter-authorization"],
        queryFn: async () => {
            try {
                const checkVoteAuthorization = await axios.get(
                    `/api/v1/public/event/${election.eventId}/election/${election.id}/check-vote-auth/`
                );

                const voter: TMemberAttendeesMinimalInfo =
                    checkVoteAuthorization.data;
                toast.success(
                    `Congratulations ${voter.firstName}, you are authorized to vote 🎉.`
                );
                return checkVoteAuthorization.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        retry: 0,
    });

    return { voter, isPending, isError, error };
};

export const useCastVote = ( election: TElection, onSuccess?: (data: TMemberAttendeesMinimalInfo) => void ) => {
    const { data, isPending: isCasting, isError: isCastError, error: castError, mutate: castVote, } = useMutation<TMemberAttendeesMinimalInfo, string, z.infer<typeof chosenCandidateIds>>({
        mutationKey: ["cast-vote"],
        mutationFn: async (chosenCandidatesIds) => {
            try {
                const voteSubmission = await axios.post(
                    `/api/v1/public/event/${election.eventId}/election/${election.id}/submit-vote`,
                    { candidateIds: chosenCandidatesIds }
                );
                toast.success("Thank you, your vote has been submitted 🥳");
                if (onSuccess) onSuccess(voteSubmission.data);
                return voteSubmission.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { data, isCasting, isCastError, castError, castVote };
};

export const useVoterAuthorization = ( eventId: number | string, electionId: number | string, voterId: string, onAuthorize: (voter: TMemberAttendeesMinimalInfo) => void) => {
    const { data: authenticatedVoter, isPending, mutate: getAuthorization, isError, error, } = useMutation< TMemberAttendeesMinimalInfo, string, z.infer<typeof voterVerificationFormSchema>>({
        mutationKey: ["authorize-voter", voterId],
        mutationFn: async (data) => {
            try {
                const request = await axios.post(
                    `/api/v1/public/event/${eventId}/election/${electionId}/authorize-voter`,
                    data,
                    { withCredentials: true }
                );
                onAuthorize(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { authenticatedVoter, isPending, getAuthorization, isError, error };
};
