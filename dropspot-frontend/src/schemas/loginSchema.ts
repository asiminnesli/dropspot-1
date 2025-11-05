import { z } from "zod";
import i18n from "../i18n";
import { TFunction } from "node_modules/i18next/typescript/t";

export const createLoginSchema = (t: TFunction) => z.object({
    email: z.string().email({ message: t("invalid_email") }),
    password: z.string().min(6, { message: t("password_min_length") }),
});

export type LoginInput = z.infer<typeof createLoginSchema>;