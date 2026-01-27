import { IncentiveClaims } from "@prisma/client";
import { TUserMinimalInfo } from "./user.types";
import { TMemberAttendeeMinimalInfo } from "./member-attendees.types";
import { TIncentive, TIncentiveMinimalInfo } from "./incentive.types";
import {
  TIncentiveAssigned,
  TIncentiveAssignedMinimalInfo,
  TIncentiveAssignedWithUserMinimalInfo,
} from "./incentive-assigned.types";

export type TIncentiveClaims = IncentiveClaims;

export type TIncentiveClaimsWithIncentiveAndClaimAssistance =
  TIncentiveClaims & {
    assigned: TIncentiveAssignedWithUserMinimalInfo | null;
    incentive: TIncentive;
  };

export type TIncentiveClaimsMinimalInfo = {
  id: number;
  eventId: number;
  eventAttendeeId: string;
  createdAt: Date;
  claimedOnline: boolean;
  releasedAt: Date;
  eventAttendee: TMemberAttendeeMinimalInfo;
};

export type TIncentiveClaimsWithIncentiveAttendeeAssistedBy =
  TIncentiveClaimsMinimalInfo & {
    eventAttendee: TMemberAttendeeMinimalInfo;
    incentive: TIncentiveMinimalInfo;
    assistedBy: TUserMinimalInfo | null;
  };

// for claim auth for public
export type TIncentiveClaimAuth = {
  eventId: number;
  attendeeId: string;
  passbookNumber: string;
};

export type TIncentiveClaimsWithIncentiveAndAssisted = TIncentive & {
  incentive: TIncentiveMinimalInfo;
  assistedBy: TUserMinimalInfo | null;
};

export type TIncentiveClaimReportsPerUser = {
  user: TUserMinimalInfo;
  incentives: TIncentiveMinimalInfo[];
  incentiveAssigned: {
    _count: {
      claims: number;
    };
    assignedQuantity : number;
    incentiveId: number;
    userId: number;
  }[];
  membersAssisted: {
    id: string;
    passbookNumber: string;
    firstName: string;
    lastName: string;
    incentiveClaimed: { incentiveId: number }[];
  }[];
};
