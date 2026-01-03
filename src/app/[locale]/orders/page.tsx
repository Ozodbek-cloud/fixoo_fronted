"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HammerLoader from "../../components/HammerLoader";
import RatingModal from "../../components/RatingModal";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  Plus,
  History,
  AlertCircle,
  Lock
} from "lucide-react";

interface Order {
  id: number | string;
  clientName: string;
  clientPhone: string;
  masterName: string;
  masterPhone?: string;
  service: string;
  address: string;
  date: string;
  time: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  description: string;
  price?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    orderId: "",
    targetName: "",
    orderToComplete: null as Order | null,
  });

  const fetchOrders = useCallback(() => {
    setIsLoading(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Load from localStorage
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');

    // For demo: if I am a master, I should see orders assigned to me
    // If I am a user, I should see orders I created
    // Since we don't have a real auth system for masters yet, we'll show all orders for now
    // but filter by role if possible.

    setOrders(localOrders);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = (orderId: number | string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    toast.success(`Buyurtma holati yangilandi: ${newStatus}`);
  };

  const handleCompleteOrder = (order: Order) => {
    setRatingModal({
      isOpen: true,
      orderId: String(order.id),
      targetName: userRole === "MASTER" ? order.clientName : order.masterName,
      orderToComplete: order,
    });
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (ratingModal.orderToComplete) {
      updateOrderStatus(ratingModal.orderToComplete.id, "COMPLETED");
      toast.success("Baho va izoh yuborildi!");
    }
    setRatingModal({ ...ratingModal, isOpen: false });
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING": return "bg-orange-100 text-orange-800";
      case "ACCEPTED": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "PENDING": return "Kutilmoqda";
      case "ACCEPTED": return "Qabul qilingan";
      case "COMPLETED": return "Bajarilgan";
      case "CANCELLED": return "Bekor qilingan";
      default: return status;
    }
  };

  const pendingOrders = orders.filter(o => o.status === "PENDING" || o.status === "ACCEPTED");
  const historyOrders = orders.filter(o => o.status === "COMPLETED" || o.status === "CANCELLED");

  const displayOrders = activeTab === "new" ? pendingOrders : historyOrders;

  if (isLoading) {
    return <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Buyurtmalar</h1>
          <p className="text-gray-500 font-medium text-lg">
            {userRole === "MASTER"
              ? "Sizga kelgan ish so'rovlarini boshqaring"
              : "Siz yuborgan buyurtmalar holatini kuzatib boring"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1.5 rounded-[2rem] shadow-sm border border-gray-100 mb-10 max-w-md">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3.5 rounded-[1.5rem] font-black transition-all ${activeTab === 'new' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Faol
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3.5 rounded-[1.5rem] font-black transition-all ${activeTab === 'history' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Tarix
          </button>
        </div>

        {displayOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Buyurtmalar topilmadi</h3>
            <p className="text-gray-500">Hozircha bu bo'limda hech qanday ma'lumot yo'q</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-black text-xl">
                      {(userRole === "MASTER" ? order.clientName : order.masterName).charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">
                        {userRole === "MASTER" ? order.clientName : order.masterName}
                      </h3>
                      <p className="text-teal-600 font-bold text-sm">{order.service || "Xizmat ko'rsatish"}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-gray-600 font-medium">
                    <MapPin size={18} className="text-teal-600" />
                    {order.address}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 font-medium">
                    <Calendar size={18} className="text-teal-600" />
                    {new Date(order.date || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3 font-black">
                    <Phone size={18} className="text-teal-600" />
                    {order.status === "ACCEPTED" || order.status === "COMPLETED" ? (
                      <span className="text-gray-900">{userRole === "MASTER" ? order.clientPhone : "+998 90 123 45 67"}</span>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>+998 •• ••• •• ••</span>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-[10px] uppercase">
                          <Lock size={10} />
                          Yashirin
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    &ldquo;{order.description}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                {activeTab === "new" && (
                  <div className="flex gap-4">
                    {order.status === "PENDING" && userRole === "MASTER" && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, "ACCEPTED")}
                          className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={20} />
                          Qabul qilish
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                          className="flex-1 py-4 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={20} />
                          Rad etish
                        </button>
                      </>
                    )}
                    {order.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleCompleteOrder(order)}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Ishni yakunlash
                      </button>
                    )}
                    {order.status === "PENDING" && userRole !== "MASTER" && (
                      <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-center">
                        Usta javobini kutilmoqda...
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ ...ratingModal, isOpen: false })}
        onSubmit={handleRatingSubmit}
        targetUserName={ratingModal.targetName}
        userType={userRole === "MASTER" ? "client" : "specialist"}
        orderId={ratingModal.orderId}
      />

      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}
