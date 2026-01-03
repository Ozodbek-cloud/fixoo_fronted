'use client';

import React, { useState } from 'react';
import { X, MapPin, ClipboardList, Send, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'react-toastify';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    masterName: string;
    masterId: number;
}

export default function BookingModal({ isOpen, onClose, masterName, masterId }: BookingModalProps) {
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.length < 20) {
            toast.error("Iltimos, ish tavsifini batafsilroq yozing (kamida 20 ta belgi)");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const newOrder = {
                id: Date.now(),
                masterId,
                masterName,
                description,
                address,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
            };

            // Save to localStorage
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

            setIsSubmitting(false);
            toast.success("So'rovingiz yuborildi! Usta qabul qilgandan so'ng sizga xabar beramiz.");
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-teal-700 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-black mb-2">Bog'lanish</h2>
                    <p className="text-teal-100 font-medium opacity-80">Usta: <span className="text-white font-bold">{masterName}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                            <Info size={16} className="text-teal-600" />
                            Ish tavsifi *
                        </label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Qanday ish bajarilishi kerak? Iltimos, batafsilroq yozing..."
                            className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium resize-none"
                        />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {description.length < 20 ? `Yana ${20 - description.length} ta belgi kiritish kerak` : "Yetarli ma'lumot"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                            <MapPin size={16} className="text-teal-600" />
                            Manzil *
                        </label>
                        <input
                            required
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ish bajariladigan manzilni kiriting"
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                        />
                    </div>

                    <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 flex gap-3">
                        <Info size={20} className="text-teal-600 flex-shrink-0" />
                        <p className="text-xs text-teal-800 leading-relaxed font-medium">
                            Xavfsizlik maqsadida, usta so'rovingizni qabul qilmaguncha telefon raqamlaringiz bir-biringizga ko'rinmaydi.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || description.length < 20}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting || description.length < 20 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-xl shadow-teal-600/20'}`}
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={20} />
                                So'rovni yuborish
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
