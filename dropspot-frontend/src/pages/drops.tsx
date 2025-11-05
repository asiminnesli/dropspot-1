import { useEffect, useState } from "react";
import api from "../api/axios";
import { DropComponent } from "../components/Drop";
import { Drop } from "../types/Drop.type";
import { AnimatePresence } from "framer-motion";
import { DropDetailPopup } from "../components/DropDetailPopup";

export default function DropsPage() {
    const [drops, setDrops] = useState<Drop[]>([]);
    const [userDrops, setUserDrops] = useState<any[]>([]);
    const [myClaimedDrops, setMyClaimedDrops] = useState<any[]>([]);
    const [detailsPopupDrop, setDetailPopupDrop] = useState<Drop | null>(null);

    const fetchDrops = async () => {
        try {
            const res = await api.get("/drops");
            const drops = res.data.data.drops.map((drop: any) => ({
                ...drop,
                tags: drop.tags ? drop.tags.split("|") : [],
                mediaUrls: drop.mediaUrl ? drop.mediaUrl.split("|") : [],
            }));
            setDrops(drops);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserDrops = async () => {
        try {
            const res = await api.get("/drops/myDrops");
            const myWaitlist = res.data.data.myWaitlist;
            setUserDrops(myWaitlist);
        } catch (err) {
            console.error(err);
        }
    };

    const getClaimedDrops = async () => {
        try {
            const res = await api.get("/drops/myClaimedDrops");
            const myClaimedDrops = res.data.data.myClaimedDrops;

            setMyClaimedDrops(myClaimedDrops);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDrops();
        getUserDrops();
        getClaimedDrops();
    }, []);

    useEffect(() => {
        fetchDrops();
    }, [userDrops, myClaimedDrops])

    return (
        <div className="min-h-screen bg-gray-200 text-white p-3 sm:p-3">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-center">
                {drops.map((drop) => (
                    <DropComponent
                        key={drop.id}
                        dropProps={drop}
                        isWaitlist={userDrops.some((d) => d.dropId === drop.id)}
                        setDetailPopupDrop={setDetailPopupDrop}
                        claimCode={myClaimedDrops.find((d) => d.dropId === drop.id)?.claimedCode || ""}
                    />
                ))}
            </div>
            <AnimatePresence>
                {detailsPopupDrop && (
                    <DropDetailPopup
                        drop={detailsPopupDrop}
                        onWaitlistChange={(dropId: string, isJoined: boolean) => {
                            setUserDrops((prev) =>
                                isJoined
                                    ? [...prev, { dropId }]
                                    : prev.filter((d) => d.dropId !== dropId)
                            );
                        }}
                        isWaitlisted={userDrops.some((d) => d.dropId === detailsPopupDrop.id)}
                        onClose={() => setDetailPopupDrop(null)}
                        claimCode={myClaimedDrops.find((d) => d.dropId === detailsPopupDrop.id)?.claimedCode || ""}
                    />
                )}
            </AnimatePresence>
        </div>

    );
}