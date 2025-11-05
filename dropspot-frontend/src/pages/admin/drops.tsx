import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { Drop } from "@/types/Drop.type";

export default function AdminDropsPage() {
    const [drops, setDrops] = useState<Drop[]>([]);
    const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);

    const fetchDrops = async () => {
        const res = await api.get("/admin/drops");
        const drops = res.data.data.drops.map((drop: any) => ({
            ...drop,
            tags: drop.tags.split("|"),
            mediaUrls: drop.mediaUrl.split("|"),
            claimWindowStart: new Date(drop.claimWindowStart).toISOString(),
            claimWindowEnd: new Date(drop.claimWindowEnd).toISOString(),
        }));
        setDrops(drops);
    };

    useEffect(() => {
        fetchDrops();
    }, []);

    const handleSave = async () => {
        try {
            const dropData = {
                ...selectedDrop,
                claimWindowStart: new Date(selectedDrop!.claimWindowStart).toISOString(),
                claimWindowEnd: new Date(selectedDrop!.claimWindowEnd).toISOString(),
            };

            if (selectedDrop?.id) {
                await api.put(`/admin/drops/${selectedDrop.id}`, dropData);
            } else {
                await api.post(`/admin/drops`, dropData);
            }

            setSelectedDrop(null);
            fetchDrops();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Emin misin?")) return;
        await api.delete(`/admin/drops/${id}`);
        fetchDrops();
    };

    const handleAddNew = () => {
        setSelectedDrop({
            id: "",
            name: "",
            stock: 0,
            tags: [],
            mediaUrls: [],
            createdAt: "",
            claimWindowStart: "",
            claimWindowEnd: "",
        } as Drop);
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Drops Yönetimi</h1>
                <button
                    onClick={handleAddNew}
                    className="w-10 h-10 rounded-full bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center hover:bg-indigo-700 transition"
                >
                    +
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drops && drops.map((drop) => (
                    <div
                        key={drop.id}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
                        onClick={() => setSelectedDrop(drop)}
                    >
                        <h2 className="text-lg font-medium">{drop.name}</h2>
                        <img src={drop.mediaUrls[0]} alt={drop.name} className="w-full h-48 object-cover mt-2 rounded" />
                        {/* <p className="text-sm text-gray-500">{drop?.tags?.join(", ")}</p> */}
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            Stock : {drop.stock}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            {drop.claimWindowStart?.slice(0, 10)} -{" "}
                            {drop.claimWindowEnd?.slice(0, 10)}
                        </p>
                    </div>
                ))}
            </div>

            {selectedDrop && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
                        <h2 className="text-xl font-semibold">
                            {selectedDrop.id ? "Drop Düzenle" : "Yeni Drop Ekle"}
                        </h2>

                        <label className="block font-medium">İsim</label>
                        <input
                            type="text"
                            placeholder="Adı"
                            className="w-full border rounded p-2"
                            value={selectedDrop.name}
                            onChange={(e) =>
                                setSelectedDrop({ ...selectedDrop, name: e.target.value })
                            }
                        />
                        <label className="block font-medium">claim window başlangıcı</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded p-2"
                            value={selectedDrop.claimWindowStart.slice(0, 16)}
                            onChange={(e) =>
                                setSelectedDrop({
                                    ...selectedDrop,
                                    claimWindowStart: new Date(e.target.value).toISOString(),
                                })
                            }
                        />
                        <label className="block font-medium">claim window bitişi</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded p-2"
                            value={selectedDrop.claimWindowEnd.slice(0, 16)}
                            onChange={(e) =>
                                setSelectedDrop({
                                    ...selectedDrop,
                                    claimWindowEnd: new Date(e.target.value).toISOString(),
                                })
                            }
                        />
                        <label className="block font-medium">Tags</label>
                        <input
                            type="text"
                            placeholder="Etiketler (pipe ile |)"
                            className="w-full border rounded p-2"
                            value={selectedDrop.tags.join("|")}
                            onChange={(e) =>
                                setSelectedDrop({
                                    ...selectedDrop,
                                    tags: e.target.value.split("|").map((t) => t.trim()),
                                })
                            }
                        />

                        <label className="block font-medium">media url</label>
                        <input
                            type="text"
                            placeholder="Media URL"
                            className="w-full border rounded p-2"
                            value={selectedDrop.mediaUrls.join("|")}
                            onChange={(e) =>
                                setSelectedDrop({
                                    ...selectedDrop,
                                    mediaUrls: e.target.value.split("|").map((u) => u.trim()),
                                })
                            }
                        />

                        <div className="flex justify-between">
                            {selectedDrop.id && (
                                <button
                                    onClick={() => handleDelete(selectedDrop.id!)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={() => setSelectedDrop(null)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}