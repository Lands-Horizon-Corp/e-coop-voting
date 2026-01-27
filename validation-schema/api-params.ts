import z from "zod";

import { coopIdSchema } from "./coop";
import { memberIdSchema } from "./member";
import { claimIdSchema } from "./incentive";
import { eventIdSchema, incentiveAssignIdParamSchema, incentiveIdSchema } from "./commons";
import { branchIdSchema } from "./branch";

export const coopIdParamSchema = z.object({
    id : coopIdSchema
})

export const eventIdParamSchema = z.object({
    id : eventIdSchema
})

export const eventIdAndClaimIdParamSchema = z.object({
    id : eventIdSchema,
    claimId : claimIdSchema
})

export const eventAndIncentiveParamSchema = z.object({
    id: eventIdSchema,
    incentiveId: incentiveIdSchema,
});

export const incentiveIdAndAssignIdParamSchema = z.object({
    incentiveId: incentiveIdSchema,
    assignId: incentiveAssignIdParamSchema,
});

export const eventIdandMemberIdParamSchema = z.object({
    id : eventIdSchema,
    memberId : memberIdSchema
})

export const branchIdParamSchema = z.object({
    id : branchIdSchema
})
