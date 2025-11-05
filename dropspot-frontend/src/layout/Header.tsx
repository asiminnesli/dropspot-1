import { useAppStore } from "../stores/userStore";
import { Link } from "react-router-dom";

export default function Header() {
    const user = useAppStore((state) => state.user);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <Link to="/" className="text-2xl font-bold text-purple-700">
                    DropSpot
                </Link>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span>Merhaba, {user.fullName}!</span>
                            <Link to="/login" className="text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg font-medium">
                                Çıkış Yap
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className="text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg font-medium">
                            Giriş
                        </Link>
                    )}

                </nav>
            </div>
        </header>
    );
}