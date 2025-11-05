import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Kullanıcı tipi
interface User {
    id: string;
    email: string;
    role: string;
}

// Context tipi
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
}

// Context oluştur, undefined başlat
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Uygulama başladığında localStorage'dan kullanıcıyı yükle
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};