import { $Enums, EventAttendees } from "@prisma/client";

export type TCreateMember = {
    passbookNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: $Enums.gender;
    birthday?: Date | undefined | null | string;
    contact?: string;
    picture?: string | null;
    eventId?: number;
    emailAddress?: string | null;
};

export type TCreateManyMember = {
    passbookNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: $Enums.gender | null;
    birthday: Date | null;
    contact: string | null;
    picture: string | null;
    eventId?: number;
    emailAddress: string | null;
    createdBy: number;
};
export type TSkippedMembers = {
    passbookNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: $Enums.gender;
    birthday: Date | undefined;
    contact: string | undefined;
    emailAddress: string | undefined;
};
export type TUpdateMember = {
    passbookNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: $Enums.gender;
    birthday?: Date | undefined | string;
    contact?: string;
    picture: string | null;
    eventId?: number;
    emailAddress?: string | null;
};

export type TMember = EventAttendees;

export type TMemberWithEventElectionId = EventAttendees & {
    event: {
        election: {
            id: number;
        } | null;
    };
};
