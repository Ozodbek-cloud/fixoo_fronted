"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: (status: boolean) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen: open, onClose, onStatusChange }) => {
    const [mode, setMode] = useState<"online" | "busy">("online");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [yes, setYes] = useState(false);

    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ show: boolean; msg: string }>({
        show: false,
        msg: ""
    });

    async function handleSubmit() {
        try {
            const token = localStorage.getItem("accessToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (mode === "busy") {
                await axios.patch(
                    "https://fixoo-backend.onrender.com/api/v1/master/check/busy",
                    {
                        startTime: new Date(startTime + ":00"),
                        endTime: new Date(endTime + ":00"),
                        IsBusy: yes
                    },
                    config
                );
            } else {
                await axios.patch(
                    "https://fixoo-backend.onrender.com/api/v1/master/busy/cancel",
                    {},
                    config
                );
            }

            onClose();
            if (onStatusChange) onStatusChange(mode === "online");
            setSuccessModal(true);
            setTimeout(() => setSuccessModal(false), 2500);

        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Noma'lum xatolik";

            setErrorModal({ show: true, msg });
            setTimeout(() => setErrorModal({ show: false, msg: "" }), 3000);
        }
    }

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* MAIN MODAL */}
            <div
                className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-300 
                ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            >
                <div
                    onClick={onClose}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 
                    ${open ? "opacity-100" : "opacity-0"}`}
                />

                <div
                    className={`relative mt-16 w-[95%] max-w-2xl rounded-2xl bg-white shadow-2xl transition-all duration-300 transform 
                    ${open ? "translate-y-0 opacity-100" : "-translate-y-40 opacity-0"}`}
                >
                    <div className="px-8 pt-8 pb-5 border-b">
                        <h3 className="text-center text-xl font-semibold text-slate-800">
                            Bandlik Holatini Sozlash
                        </h3>
                    </div>

                    <div className="px-8 py-6">
                        <div className="space-y-4">
                            <label
                                onClick={() => setMode("online")}
                                className={`flex items-center rounded-xl p-4 cursor-pointer 
                                ${mode === "online" ? "border-2 border-green-300 bg-green-50" : "border border-slate-200"}`}
                            >
                                <input
                                    type="radio"
                                    checked={mode === "online"}
                                    onChange={() => setMode("online")}
                                    className="w-5 h-5 accent-green-500 mr-3"
                                />
                                <span className="text-base text-slate-800 font-medium">
                                    Buyurtma olishga tayyor (Online)
                                </span>
                            </label>

                            <label
                                onClick={() => setMode("busy")}
                                className={`flex items-center rounded-xl p-4 cursor-pointer 
                                ${mode === "busy" ? "border-2 border-green-300 bg-green-50" : "border border-slate-200"}`}
                            >
                                <input
                                    type="radio"
                                    checked={mode === "busy"}
                                    onChange={() => setMode("busy")}
                                    className="w-5 h-5 accent-green-500 mr-3"
                                />
                                <span className="text-base text-slate-700">
                                    Vaqtinchalik Band Rejimini Yoqish
                                </span>
                            </label>
                        </div>

                        <div className={`mt-6 rounded-xl p-5 
                            ${mode === "online" ? "bg-slate-100 opacity-50 pointer-events-none" : "bg-slate-50"}`}
                        >
                            <label className="block text-sm text-slate-500 mb-1">
                                Bandlik boshlanish sanasi:
                            </label>
                            <input
                                onChange={(e) => setStartTime(e.target.value)}
                                type="datetime-local"
                                disabled={mode === "online"}
                                className="w-full rounded-lg px-4 py-3 bg-white text-base"
                            />

                            <label className="block text-sm text-slate-500 mt-5 mb-1">
                                Bandlik tugash sanasi:
                            </label>
                            <input
                                onChange={(e) => setEndTime(e.target.value)}
                                type="datetime-local"
                                disabled={mode === "online"}
                                className="w-full rounded-lg px-4 py-3 bg-white text-base"
                            />

                            <label className="flex items-center gap-3 mt-4">
                                <input
                                    onClick={() => setYes(!yes)}
                                    type="checkbox"
                                    disabled={mode === "online"}
                                    className="accent-green-500 w-5 h-5"
                                />
                                <span className="text-base text-slate-700">
                                    Bandlik davrida buyurtmalar qabul qilinmasin
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-between px-8 py-5 border-t">
                        <button
                            onClick={onClose}
                            className="px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => handleSubmit()}
                            className="px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                        >
                            Saqlash
                        </button>
                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            {successModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[60]">
                    <div className="bg-green-500 text-white text-xl px-10 py-6 rounded-2xl shadow-2xl animate-bounce">
                        Muvaffaqiyatli saqlandi!
                    </div>
                </div>
            )}

            {/* ERROR MODAL */}
            {errorModal.show && (
                <div className="fixed inset-0 flex items-center justify-center z-[60]">
                    <div className="bg-red-500 text-white text-xl max-w-xl px-10 py-6 rounded-2xl shadow-2xl animate-bounce text-center">
                        {errorModal.msg}
                    </div>
                </div>
            )}
        </>
    );
};

export default StatusModal;
