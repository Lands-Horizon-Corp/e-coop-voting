import z from "zod";
import { eventIdSchema, incentiveIdSchema, otpSchema, passbookNumberSchema, userIdSchema } from "./commons";
import { memberIdSchema } from "./member";
import { ClaimRequirements } from "@prisma/client";

export const assignedQuantitySchema = z.coerce.number({ invalid_type_error : "invalid alotted", required_error : "alotted is required" })

export const claimRequirementsEnum = z.nativeEnum(ClaimRequirements, { invalid_type_error : "invalid incentive requirement type" })

export const createIncentiveSchema = z.object({
    itemName : z.string({ required_error : "Item name is required", invalid_type_error : "invalid type for item name"}).min(2, "Item name too short"),
    claimRequirement : claimRequirementsEnum
})

export const updateIncentiveSchema = createIncentiveSchema;

export const assignIncentiveSchema = z.object({ id : userIdSchema })

export const createIncentiveAssigneeSchema = z.object({
    userId : userIdSchema,
    assignedQuantity : assignedQuantitySchema
})

export const updateIncentiveAssignedSchema = z.object({
   assignedQuantity : assignedQuantitySchema
})

// for claimings
export const claimIdSchema = z.coerce.number({ invalid_type_error : "claim id is invalid", required_error : "claim id is required"})

export const claimsEntrySchema = z.object({
    eventId : eventIdSchema,
    eventAttendeeId : memberIdSchema,
    incentiveId : incentiveIdSchema,
    assignedId : z.coerce.number({invalid_type_error : "invalid assigned id", required_error : "assign id is required"}),
})

export const claimReleaseSchema = z.object({
    incentiveItemId : incentiveIdSchema
})

export const createAssistedClaimSchema = z.object({
    claims : z.array(claimsEntrySchema)
})

// for claiming public
export const createIncentiveClaimPublic = z.object({
    incentiveId : incentiveIdSchema
})

export const createPublicClaimAuthorizationFormSchema = z.object({
    otp : otpSchema,
})

export const createPublicClaimAuthorizationSchema = z.object({
    passbookNumber : passbookNumberSchema,
    otp : otpSchema,
})
