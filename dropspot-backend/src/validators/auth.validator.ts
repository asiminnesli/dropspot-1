import { z } from "zod";
import { ValidationErrors } from "../constants/AppErrors";


export const registerSchema = z.object({
    email: z.string().email(ValidationErrors.EMAIL_INVALID.code),
    password: z
        .string()
        .min(6, ValidationErrors.PASSWORD_MIN_6_CHAR.code)
        .max(100, ValidationErrors.PASSWORD_MAX_100_CHAR.code),
    fullName: z.string(),

});

export const loginSchema = z.object({
    email: z.string().email(ValidationErrors.EMAIL_INVALID.code),
    password: z.string().min(6, ValidationErrors.PASSWORD_MIN_6_CHAR.code),
});