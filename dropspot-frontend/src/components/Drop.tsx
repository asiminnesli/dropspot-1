import { motion } from "framer-motion";
import { Drop } from "../types/Drop.type";
import api from "../api/axios";

export const DropComponent = ({ dropProps: drop, isWaitlist, setDetailPopupDrop, claimCode }: { dropProps: Drop, isWaitlist: boolean, setDetailPopupDrop: (drop: Drop | null) => void, claimCode: string }) => {
    return (
        <motion.div
            onClick={() => { setDetailPopupDrop(drop) }}
            key={drop.id}
            whileHover={{ scale: 1.02 }}
            className="relative bg-white group overflow-hidden rounded-xl h-[550px]"
        >
            {drop.mediaUrls.length > 0 && (
                <>
                    {drop.mediaUrls.map((mediaUrl, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === 0 ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            {mediaUrl.endsWith(".mp4") ? (
                                <video
                                    src={mediaUrl}
                                    loop
                                    muted
                                    playsInline
                                    className="object-cover w-full h-full"
                                    preload="metadata"
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt={drop.name}
                                    className="object-cover w-full h-full"
                                />
                            )}
                        </div>
                    ))}
                </>
            )}

            (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-center items-center text-white">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#7059ef] hover:bg-[#5b47e0] px-6 py-2 rounded-full text-lg font-semibold shadow-lg"
                >
                    İncele
                </motion.button>
            </div>
            )


            <div className="absolute bottom-0 left-0 w-full p-4">
                <h2 className="font-bold text-lg text-black/100">{drop.name}</h2>
                <div className="flex gap-2 mt-1 flex-wrap">
                    {drop.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-blue-500 rounded-full px-2 py-0.5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

