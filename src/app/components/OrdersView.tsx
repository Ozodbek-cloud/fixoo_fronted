"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    ClipboardList,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    User,
    Calendar
} from "lucide-react";
import HammerLoader from "./HammerLoader";

export default function OrdersView() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        setUserRole(role);
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const role = localStorage.getItem("userRole");
            const endpoint = role === "MASTER"
                ? "https://fixoo-backend.onrender.com/api/v1/Master/orders/history"
                : "https://fixoo-backend.onrender.com/api/v1/my/orders";

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <HammerLoader />;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-teal-500 text-white rounded-2xl shadow-lg shadow-teal-500/20">
                    <ClipboardList size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {userRole === "MASTER" ? "Yangi buyurtmalar" : "Mening buyurtmalarim"}
                    </h1>
                    <p className="text-gray-500">Barcha buyurtmalar tarixi va holati</p>
                </div>
            </div>

            {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{order.clientName || "Mijoz"}</h3>
                                        <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Sana ko'rsatilmadi"}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin size={18} className="text-teal-500" />
                                    <span className="text-sm">{order.address || "Manzil ko'rsatilmadi"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={18} className="text-teal-500" />
                                    <span className="text-sm">{order.phone || "Telefon ko'rsatilmadi"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar size={18} className="text-teal-500" />
                                    <span className="text-sm">{order.workDate || "Ish sanasi ko'rsatilmadi"}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex gap-3">
                                {userRole === "MASTER" && order.status === "PENDING" && (
                                    <>
                                        <button className="flex-1 bg-teal-500 text-white py-2.5 rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2">
                                            <CheckCircle size={18} />
                                            Qabul qilish
                                        </button>
                                        <button className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                            <XCircle size={18} />
                                            Rad etish
                                        </button>
                                    </>
                                )}
                                <button className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all">
                                    Batafsil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                        <ClipboardList size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Buyurtmalar yo'q</h3>
                    <p className="text-gray-500">Hozircha hech qanday buyurtma mavjud emas</p>
                </div>
            )}
        </div>
    );
}
