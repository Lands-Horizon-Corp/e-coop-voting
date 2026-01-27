import { EventType } from "@prisma/client";
import z from "zod";
import { memberSearchOptionEnums } from "./event-settings";
import { eventIdParamSchema } from "./api-params";
import { passbookNumberSchema } from "./commons";

const commonFieldErrors = {
    required_error: "This field is required",
    invalid_type_error: "Invalid data type",
};

const commonFieldErrorsMinimum = {
    required_error: "Field must contain at least 1 character(s)",
};

export const adminRegisterMemberSchema = z.object({
    passbookNumber: passbookNumberSchema,
    operation: z.enum(["register", "unregister"]).default("register"),
});

export const createEventSchema = z.object({
    title: z
        .string({
            ...commonFieldErrors,
        })
        .min(1, commonFieldErrorsMinimum.required_error),
    description: z
        .string({
            ...commonFieldErrors,
        })
        .min(1, commonFieldErrorsMinimum.required_error),
    date: z.coerce.date({
        ...commonFieldErrors,
    }),
    location: z
        .string({
            ...commonFieldErrors,
        })
        .min(1, commonFieldErrorsMinimum.required_error),
    coverImage: z
        .string({
            ...commonFieldErrors,
        })
        .nullable(),
    category: z.nativeEnum(EventType, {
        ...commonFieldErrors,
    }),
    deleted: z
        .boolean({
            invalid_type_error: "Deleted attribute must be a boolean",
        })
        .nullable()
        .optional(),
    branchId: z.coerce.number({ ...commonFieldErrors }),
    coopId: z.coerce.number({ ...commonFieldErrors }),
});

export const updateEventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.coerce.date({ required_error: "Event date is required" }),
    location: z.string().min(1, "Event location is required"),
    coverImage: z.any().optional(),

    isRegistrationOpen: z
        .boolean({
            invalid_type_error: "invalid registration open tatus",
        })
        .default(false),

    requireBirthdayVerification: z
        .boolean({
            invalid_type_error: "invalid event settings",
        })
        .default(false),

    registrationOnEvent: z
        .boolean({
            invalid_type_error: "registration on event settings is invalid",
        })
        .default(false),
    defaultMemberSearchMode: memberSearchOptionEnums.default("ByPassbook"),
});

// export const updateEventSchema = createEventSchema
//    .pick({
//       title: true,
//       description: true,
//       date: true,
//       location: true,
//       branchId:true,
//       coopId:true,
//    })
//    .merge(
//       z.object({
//          coverImage: z.any().optional(),
//       })
//    );

export const createEventWithElectionSchema = (isElection: boolean) => {
    return createEventSchema.extend({
        electionName: isElection
            ? z
                  .string({
                      ...commonFieldErrors,
                  })
                  .min(1)
            : z.string({ ...commonFieldErrors }).optional(),
    });
};

export const createEventWithElectionWithUploadSchema = (
    isElection: boolean
) => {
    return createEventWithElectionSchema(isElection).extend({
        coverImage: z.any().optional(),
    });
};
