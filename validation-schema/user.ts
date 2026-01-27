import { Role } from "@prisma/client";
import z from "zod";

export const roleEnum = z.nativeEnum(Role, {
    invalid_type_error: "invalid role",
});

export const userIdSchema = z.coerce.number({
    invalid_type_error: "invalid id",
    required_error: "ids is required",
});

export const userIdsSchema = z.array(userIdSchema);

export const createUserSchema = z.object({
    // picture : z.string().min(5, "invalid image URL").optional(),
    name: z
        .string({
            required_error: "name is required",
            invalid_type_error: "invalid name",
        })
        .min(1, "name is required"),
    email: z
        .string({
            required_error: "email is required",
            invalid_type_error: "invalid email",
        })
        .min(1, "email is required")
        .email("please provide a valid email"),
    password: z
        .string({
            required_error: "password is required",
            invalid_type_error: "invalid password",
        })
        .min(8, "minimum password is 8 character")
        .max(15, "maximum password size is 15 character"),
    role: roleEnum,
    branchId: z.coerce
        .number({
            required_error: "branch is required",
            invalid_type_error: "invalid branch",
        })
        .min(1, "Please select a branch"),
});

export const updateUserSchema = z.object({
    picture: z.string().min(5, "invalid image URL").optional(),
    name: z
        .string({
            required_error: "name is required",
            invalid_type_error: "invalid name",
        })
        .min(1, "name is required"),
    email: z
        .string({
            required_error: "email is required",
            invalid_type_error: "invalid email",
        })
        .min(1, "email is required")
        .email("please provide a valid email"),
    password: z
        .string({
            required_error: "password is required",
            invalid_type_error: "invalid password",
        })
        .min(8, "minimum password is 8 character")
        .max(15, "maximum password size is 15 character")
        .optional(),
    role: roleEnum,
    branchId: z.coerce
        .number({
            required_error: "branch is required",
            invalid_type_error: "invalid branch",
        })
        .min(1, "Please select a branch"),
});
