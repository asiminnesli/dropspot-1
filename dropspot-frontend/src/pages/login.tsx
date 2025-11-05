import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { LoginForm } from "../components/LoginForm";
import { LoginInput } from "../schemas/loginSchema";
import { useAppStore } from "../stores/userStore";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAppStore();
    const [error, setError] = useState<string>("");

    const handleLogin = async (data: LoginInput) => {
        setError("");
        try {
            const res = await axios.post("/auth/login", data);
            if (res.data.success) {
                login(res.data.data.token, res.data.data.user);
                navigate("/");
            } else {
                setError(res.data.message || "Login başarısız, lütfen tekrar deneyin.");
            }
        } catch (err: any) {
            setError(err?.message || "Login başarısız, lütfen tekrar deneyin.");
            console.error("Login error:", err);
        }
    };

    return <LoginForm onSubmit={handleLogin} error={error} />;
}