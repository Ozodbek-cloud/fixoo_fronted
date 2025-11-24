"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

interface StatusModalProps {
    open: boolean;
    onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ open, onClose }) => {
    const [mode, setMode] = useState<"online" | "busy">("online");
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [yes, setYes] = useState(false)

    async function handleSubmit() {
        try {
            const token = localStorage.getItem("accessToken");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (mode === 'busy') {
                await axios.patch(
                    'https://fixoo-backend.onrender.com/api/v1/master/check/busy',
                    {
                        startTime: new Date(startTime + ":00"),
                        endTime: new Date(endTime + ":00"),
                        IsBusy: yes
                    },
                    config
                ).then((data => console.log(data)));
            } else {
                await axios.patch(
                    'https://fixoo-backend.onrender.com/api/v1/master/busy/cancel',
                    {},
                    config
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-300     ${open ? "pointer-events-auto" : "pointer-events-none"}   `} >
            <div onClick={onClose} className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300   ${open ? "opacity-100" : "opacity-0"} `} />

            <div className={`relative mt-8 w-[92%] max-w-xl rounded-xl bg-white shadow-2xl transition-all duration-300 transform    ${open ? "translate-y-0 opacity-100" : "-translate-y-40 opacity-0"}  `}      >
                <div className="px-6 pt-6 pb-4 border-b">
                    <h3 className="text-center text-lg font-semibold text-slate-800">
                        Bandlik Holatini Sozlash
                    </h3>
                </div>

                <div className="px-6 py-5">
                    <div className="space-y-3">
                        <label onClick={() => setMode("online")} className={`flex items-center rounded-lg p-3 cursor-pointer ${mode === "online" ? "border-2 border-green-300 bg-green-50" : "border border-slate-200"}`}                        >
                            <input type="radio" name="status" checked={mode === "online"} onChange={() => setMode("online")} className="w-4 h-4 text-green-500 accent-green-500 mr-3" />
                            <span className="text-sm text-slate-800 font-medium">
                                Buyurtma olishga tayyor (Online)
                            </span>
                        </label>

                        <label onClick={() => setMode("busy")} className={`flex items-center rounded-lg p-3 cursor-pointer ${mode === "busy" ? "border-2 border-green-300 bg-green-50" : "border border-slate-200"}`}                    >
                            <input type="radio" name="status" checked={mode === "busy"} onChange={() => setMode("busy")} className="w-4 h-4 text-green-500 accent-green-500 mr-3" />
                            <span className="text-sm text-slate-700">
                                Vaqtinchalik Band Rejimini Yoqish
                            </span>
                        </label>
                    </div>

                    <div className={`mt-5 rounded-lg  p-4 ${mode === "online" ? "bg-slate-100 opacity-50 pointer-events-none" : "bg-slate-50"}`}                >
                        <label className="block text-xs text-slate-500 mb-1">
                            Bandlik boshlanish sanasi:
                        </label>
                        <input onChange={(e) => setStartTime(e.target.value)} type="datetime-local" disabled={mode === "online"} className="w-full rounded-lg  px-3 py-3 bg-white text-sm" />

                        <label className="block text-xs text-slate-500 mt-4 mb-1">
                            Bandlik tugash sanasi:
                        </label>
                        <input onChange={(e) => setEndTime(e.target.value)} type="datetime-local" disabled={mode === "online"} className="w-full rounded-lg  px-3 py-3 bg-white text-sm" />

                        <div className="mt-4">


                            <label className="flex items-center gap-2 mt-3">
                                <input onClick={() => setYes(!yes)} type="checkbox" disabled={mode === "online"} className="accent-green-500" />
                                <span className="text-sm text-slate-700">
                                    Bandlik davrida buyurtmalar qabul qilinmasin
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between px-6 py-4 border-t">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"                >
                        Bekor qilish
                    </button>
                    <button onClick={() => handleSubmit()} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                        Saqlash
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
