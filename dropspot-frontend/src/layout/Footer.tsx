export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} DropSpot. Tüm hakları saklıdır.</p>
                <div className="flex gap-4 mt-2 sm:mt-0">
                    <a href="#" className="hover:text-purple-400 text-sm">
                        Hakkımızda
                    </a>
                    <a href="#" className="hover:text-purple-400 text-sm">
                        Gizlilik Politikası
                    </a>
                    <a href="#" className="hover:text-purple-400 text-sm">
                        İletişim
                    </a>
                </div>
            </div>
        </footer>
    );
}