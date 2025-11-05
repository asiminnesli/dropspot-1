import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoginInput, createLoginSchema } from "../schemas/loginSchema";
import { z } from "zod";

interface LoginFormProps {
    onSubmit: (data: LoginInput) => void;
    error?: string;
}

export const LoginForm = ({ onSubmit, error }: LoginFormProps) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        const schema = z.object({
            email: z.string().email({ message: t("invalid_email") }),
            password: z.string().min(6, { message: t("password_min_length") }),
        });

        try {
            const parsedData = schema.parse({ email, password });
            setIsLoading(true);
            await onSubmit(parsedData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const firstIssue = err.issues?.[0];
                const msg = firstIssue?.message || t("invalid_input");
                setValidationError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">{t("login")}</h1>

            {(error || validationError) && (
                <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center">
                    {validationError || error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? t("loading") || "Yükleniyor..." : t("submit")}
                </button>
            </form>
        </div>
    );
};