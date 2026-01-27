import z from "zod";

export const emailSchema = z
    .string({
        invalid_type_error: "invalid email",
        required_error: "email is required",
    })
    .min(1, "invalid email")
    .email("invalid email");

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string({
        invalid_type_error: "invalid password",
        required_error: "password is required",
    }),
});
