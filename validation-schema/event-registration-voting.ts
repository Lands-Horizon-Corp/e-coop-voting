import z from "zod";
import {
    otpSchema,
    eventIdSchema,
    validateBirthDay,
    electionIdParamSchema,
    passbookNumberSchema,
} from "./commons";

// for event registration verification api
export const nameSearchSchema = z.string({
    required_error: "name is required",
    invalid_type_error: "invalid name search type",
});

export const attendeeParamsSchema = z.object({
    id: eventIdSchema,
    passbookNumber: passbookNumberSchema,
});

export const attendeeNameParamsSchema = z.object({
    id: eventIdSchema,
    nameSearch: nameSearchSchema,
});

// for event registration verification api
export const attendeeRegisterSchema = z.object({
    passbookNumber: passbookNumberSchema,
    birthday: validateBirthDay.optional(),
});

// for event registration for form schema
export const attendeeRegisterFormSchema = z.object({
    passbookNumber: passbookNumberSchema,
    birthday: z.coerce.date().optional(),
});

export const memberAttendeeSearchSchema = z.object({
    passbookNumber: z.string({
        invalid_type_error: "invalid passbook number",
        required_error: "passbook number is required",
    }),
    nameSearch: nameSearchSchema,
    reason: z.enum(["registration", "voting"]).default("registration"),
});

// for params
export const eventElectionParamsSchema = z.object({
    id: eventIdSchema,
    electionId: electionIdParamSchema,
});

// for voter passbook search
export const passbookSearchSchema = z.object({
    passbookNumber: passbookNumberSchema,
});

// for voter search params
export const voterSearchParamSchema = z.object({
    passbookNumber: passbookNumberSchema,
});

export const voterVerificationSchema = z.object({
    passbookNumber: passbookNumberSchema,
    otp: otpSchema.optional(),
    birthday: validateBirthDay.optional(),
});

export const voterVerificationFormSchema = z.object({
    passbookNumber: passbookNumberSchema,
    otp: otpSchema,
    birthday: validateBirthDay.optional(),
});

// for voter registration
export const voterRegistrationVerification = z.object({});
