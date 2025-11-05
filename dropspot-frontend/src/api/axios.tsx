import i18n from "../i18n";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MAX_TOASTS = 4;
let activeToasts: string[] = [];

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const code = error.response?.data?.message;

        const translated = code && i18n.exists(code) ? i18n.t(code) : i18n.t("UNKNOWN_ERROR");
        error.message = translated;

        // yeni toast’ı oluştur
        const id = toast.error(translated, {
            duration: 3000,
            style: {
                background: "#ef4444",
                color: "#fff"
            }
        });

        // toast id’lerini yönet
        activeToasts.push(id);
        if (activeToasts.length > MAX_TOASTS) {
            const removed = activeToasts.shift(); // en eski toast’ı kaldır
            if (removed) toast.dismiss(removed);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;