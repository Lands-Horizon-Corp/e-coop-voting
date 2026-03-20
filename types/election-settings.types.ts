import {
  VotingEligibility,
  VotingConfiguration,
  VotingScreenOrientation,
} from "@prisma/client";

export type SettingsType = {
  voteEligibility: VotingEligibility;
  allowBirthdayVerification: boolean;
  allowOTPVerification: boolean;
  voteConfiguration: VotingConfiguration;
  voteScreenConfiguration: VotingScreenOrientation;
  sendEmailVoteCopy: boolean;
};
