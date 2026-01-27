import { gender } from "@prisma/client";
import { z } from "zod";

const commonFieldErrorsMinimum = {
    required_error: "Field must contain at least 1 character(s)",
};

export const createMemberSchema = z.object({
    passbookNumber: z
        .string({
            required_error: "passBook Number field is required",
            invalid_type_error: "Invalid passBook Number data type",
        })
        .min(1, "passbook " + commonFieldErrorsMinimum.required_error),

    firstName: z
        .string({
            required_error: "firstname field is required",
            invalid_type_error: "Invalid firstname data type",
        })
        .min(1, "firstName " + commonFieldErrorsMinimum.required_error),

    middleName: z
        .string({
            invalid_type_error: "Invalid middle data type",
        })
        .optional(),

    lastName: z
        .string({
            required_error: "lastname field is required",
            invalid_type_error: "Invalid lastname data type",
        })
        .min(1, "lastName " + commonFieldErrorsMinimum.required_error),

    gender: z.nativeEnum(gender, {
        required_error: "gender field is required",
        invalid_type_error: "Invalid gender data type",
    }),

    birthday: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                const trimmed = val.trim();
                if (trimmed === "") return undefined;

                const parsedDate = new Date(trimmed);
                return !isNaN(parsedDate.getTime()) ? parsedDate : trimmed;
            }

            return val;
        },
        z
            .union([
                z.date(),
                z
                    .string()
                    .refine(() => false, { message: "Invalid date format" }),
            ])
            .optional()
    ),

    emailAddress: z
        .string({
            required_error: "email field is required",
            invalid_type_error: "Invalid email data type",
        })
        .optional()
        .nullable(),
    contact: z
        .string({
            required_error: "contact field is required",
            invalid_type_error: "Invalid contact data type",
        })
        .optional(),
    eventId: z.coerce
        .number({
            required_error: "event field is required",
            invalid_type_error: "Invalid event data type",
        })
        .optional(),
});

export const createMemberWithUploadSchema = createMemberSchema.extend({
    picture: z.any().optional(),
});

export const updateMemberWithUploadSchema = createMemberSchema.extend({
    picture: z.any().optional(),
});

export const createManySchema = z.object({
    passbookNumber: z
        .string({
            required_error: "passbook is Requried",
            invalid_type_error: "Invalid passBook Number data type",
        })
        .nullable(),
    firstName: z
        .string({
            required_error: "firstName is Requried",
            invalid_type_error: "Invalid firstname data type",
        })
        .nullable(),
    middleName: z
        .string({
            required_error: "middle name is Requried",
            invalid_type_error: "Invalid middle data type",
        })
        .optional()
        .nullable(),
    lastName: z
        .string({
            required_error: "lastname field is required",
            invalid_type_error: "Invalid lastname data type",
        })
        .nullable(),

    gender: z
        .string()
        .refine((value) => ["M", "Male", "F", "Female"].includes(value), {
            message:
                "Invalid gender value. Must be 'M', 'Male', 'F', or 'Female'.",
        })
        .transform((value) => {
            return value === "M" || value === "Male" ? "Male" : "Female";
        })
        .nullable(),

    birthday: z.coerce
        .date({
            required_error: "birthday is Requried",
            invalid_type_error: "Invalid birthday data type",
        })
        .optional()
        .nullable(),

    emailAddress: z
        .string({
            required_error: "email is Requried",
            invalid_type_error: "Invalid email data type",
        })
        .optional()
        .nullable(),
    contact: z
        .string({
            required_error: "contact is Requried",
            invalid_type_error: "Invalid contact data type",
        })
        .optional()
        .nullable(),
    eventId: z.coerce
        .number({
            required_error: "event field is required",
            invalid_type_error: "Invalid event data type",
        })
        .optional(),
});

export const memberEmailSchema = z
    .string({
        invalid_type_error: "invalid email",
        required_error: "Email is required",
    })
    .email("Email is required");

export const memberIdSchema = z.string({
    invalid_type_error: "member id type is invalid",
    required_error: "member id is required",
});

export const memberToggleSurveyedSchema = z.object({
    surveyed: z.coerce.boolean().default(false),
});
