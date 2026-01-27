import {
    ElectionStatus,
    VotingConfiguration,
    VotingEligibility,
    VotingScreenOrientation,
} from "@prisma/client";
import z from "zod";

export const voteEligibility = z.nativeEnum(VotingEligibility, {
    invalid_type_error: "invalid role",
});
export const electionStatus = z.nativeEnum(ElectionStatus, {
    invalid_type_error: "invalid role",
});
export const voteConfiguration = z.nativeEnum(VotingConfiguration, {
    invalid_type_error: "invalid role",
});

export const electionSettingSchema = z.object({
    voteEligibility: z.nativeEnum(VotingEligibility, {
        invalid_type_error: "invalid role",
    }),
    allowBirthdayVerification: z.boolean({
        invalid_type_error: "invalid type",
    }),
    voteConfiguration: z.nativeEnum(VotingConfiguration, {
        invalid_type_error: "invalid role",
    }),
    voteScreenConfiguration: z.nativeEnum(VotingScreenOrientation, {
        invalid_type_error: "invalid role",
    }),
    sendEmailVoteCopy: z
        .boolean({ invalid_type_error: "Invalid" })
        .default(false),
});
