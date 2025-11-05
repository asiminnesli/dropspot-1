import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Drop } from "../types/Drop.type";
import api from "../api/axios";

export const DropDetailPopup = ({ drop, onWaitlistChange, onClose, isWaitlisted: initialWaitlisted, claimCode }: { drop: Drop, onWaitlistChange: (dropId: string, isJoined: boolean) => void, onClose: () => void, isWaitlisted: boolean, claimCode: string }) => {
    const [isClaimStatus, setIsClaimStatus] = useState<string>("not_started");
    const [timeLeft, setTimeLeft] = useState<String>("");
    const [isWaitlisted, setIsWaitlisted] = useState<boolean>(initialWaitlisted);


    const onToggleWaitlist = async () => {
        try {
            const res = await api.post(`/drops/${drop.id}/${isWaitlisted ? 'leave' : "join"}`);
            if (!res.data.success) throw new Error(res.data.data.message)
            setIsWaitlisted((prev) => !prev);
        } catch (err) {
            console.error(err);
        }
    }

    const onClaim = async () => {
        try {
            const res = await api.post(`/drops/${drop.id}/claim`);
            if (!res.data.success) throw new Error(res.data.data.message)

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        onWaitlistChange(drop.id, isWaitlisted);
    }, [isWaitlisted])

    useEffect(() => {
        if (!drop?.claimWindowStart || !drop?.claimWindowEnd) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(drop.claimWindowStart).getTime();
            const end = new Date(drop.claimWindowEnd).getTime();

            if (now < start) {
                setIsClaimStatus("not_started")
                const mins = Math.floor(((start - now) / 1000 / 60) % 60);
                const hours = Math.floor(((start - now) / 1000 / 60 / 60) % 24);
                const days = Math.floor((start - now) / 1000 / 60 / 60 / 24);
                setTimeLeft(`${days}g ${hours}sa ${mins}dk`);
            } else if (now >= start && now <= end) {
                setIsClaimStatus('open')
                const mins = Math.floor(((end - now) / 1000 / 60) % 60);
                const hours = Math.floor(((end - now) / 1000 / 60 / 60) % 24);
                const days = Math.floor((end - now) / 1000 / 60 / 60 / 24);
                setTimeLeft(`${days}g ${hours}sa ${mins}dk`);
            } else {
                setIsClaimStatus('closed')
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [drop]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { onClose(); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                onClick={(e) => { e.stopPropagation() }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col md:flex-row"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {/* Kapatma butonu */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                >
                    <X size={22} />
                </button>

                {/* Sol taraf: Görsel */}
                <div className="md:w-1/2 w-full relative h-80 md:h-auto">
                    {drop.mediaUrls && drop.mediaUrls.length > 0 ? (
                        <img
                            src={drop.mediaUrls[0]}
                            alt={drop.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                            Görsel Yok
                        </div>
                    )}
                </div>

                {/* Sağ taraf: Bilgi & Butonlar */}
                <div className="md:w-1/2 w-full p-6 flex flex-col justify-between space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{drop.name}</h2>

                        {drop.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {drop.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="text-gray-600 text-sm leading-relaxed mt-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec nisl vel
                            libero fermentum aliquet non vel velit. Sed ut nunc non sapien vestibulum
                            facilisis vel sit amet orci.
                        </p>
                    </div>

                    <div>
                        {claimCode ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center">
                                <p className="font-medium">🎟️ Claim Kodun:</p>
                                <p className="text-lg font-bold mt-1">{claimCode}</p>
                            </div>
                        ) : (
                            <>
                                {isClaimStatus === "open" && (
                                    <div className="bg-indigo-50 p-4 rounded-lg text-indigo-700">
                                        <p className="text-sm font-medium">Claim window bitimine kalan süre:</p>
                                        <p className="text-lg font-semibold mt-1">{timeLeft}</p>

                                        {isWaitlisted && (
                                            <div className="flex justify-end mt-3">
                                                <button
                                                    onClick={onClaim}
                                                    className="px-4 py-2 rounded-lg font-medium transition bg-red-500 hover:bg-red-600 text-white"
                                                >
                                                    Claim
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isClaimStatus === "not_started" && (
                                    <div className="bg-indigo-50 p-4 rounded-lg text-indigo-700">
                                        <p className="text-sm font-medium">
                                            Claim window'un başlamasına kalan süre:
                                        </p>
                                        <p className="text-lg font-semibold mt-1">{timeLeft}</p>

                                        <div className="flex justify-end mt-3">
                                            <button
                                                onClick={onToggleWaitlist}
                                                className={`px-4 py-2 rounded-lg font-medium transition ${isWaitlisted
                                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    }`}
                                            >
                                                {isWaitlisted ? "Waitlist'ten Çık" : "Waitlist’e Katıl"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isClaimStatus === "closed" && (
                                    <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-center">
                                        <p className="font-medium">Drop Bitti 🕒</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

