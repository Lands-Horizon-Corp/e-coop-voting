import {
    VotingEligibility,
    VotingConfiguration,
    VotingScreenOrientation,
} from "@prisma/client";

export type SettingsType = {
    voteEligibility: VotingEligibility;
    allowBirthdayVerification: boolean;
    voteConfiguration: VotingConfiguration;
    voteScreenConfiguration: VotingScreenOrientation;
    sendEmailVoteCopy: boolean;
};
