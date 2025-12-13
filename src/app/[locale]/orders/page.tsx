"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HammerLoader from "../../components/HammerLoader";
import RatingModal from "../../components/RatingModal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Image from "next/image";
// import 'react-toastify/dist/ReactToastify.css';
interface addsInter {
  text: string,
  photoUrl: string,
  serverLink: string
}

interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  address: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  description: string;
  price?: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    orderId: "",
    clientName: "",
    orderToComplete: null as Order | null,
  });

  const [adds, setAdds] = useState<addsInter[]>([]);
  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVkY2RmOTgxLWE5NjktNDNmMS1hM2UwLTExM2M2YThkOTM0ZSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2NTU0MjA3MCwiZXhwIjoxNzY4MjIwNDcwfQ.5vPEvRv5AV4hsAe6GvkzBPQu6vYgFu_8fM-jauUhAfA";

    axios.get("https://fixoo-backend.onrender.com/advert", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setAdds(res.data);
      })
      .catch(err => {
        console.log("Error:", err);
      });
  }, []);



  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const acceptedCount = orders.filter((o) => o.status === "accepted").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  // 🧠 Buyurtmalarni yuklash
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await axios.get("https://fixoo-backend.onrender.com/api/v1/Master/orders/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ordersData = (res.data.data || []).map((order: any) => ({
        id: order.id,
        clientName: order.client?.fullName || "Noma’lum mijoz",
        clientPhone: order.client?.phone || "",
        service: order.service || order.serviceName || "",
        address: order.address || "",
        date: order.date || "",
        time: order.time || "",
        status: order.status || "pending",
        description: order.description || "",
        price: order.price || undefined,
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error("Buyurtmalarni olishda xatolik:", error);
      toast.error("Buyurtmalarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "MASTER") {
      router.push("/");
      return;
    }

    // Eski localStorage ma’lumotlarini tozalash
    localStorage.removeItem("specialistOrders");
    localStorage.removeItem("clientOrderHistory");
    localStorage.removeItem("ratings");

    fetchOrders();
  }, [router]);

  // 🧩 Har safar "Tarix" tabiga o‘tganda yangilash
  useEffect(() => {
    if (activeTab === "history") {
      fetchOrders();
    }
  }, [activeTab]);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Agar bajarilgan bo‘lsa, baho oynasini ochamiz
      if (newStatus === "completed") {
        const orderToComplete = orders.find((o) => o.id === orderId);
        if (orderToComplete) {
          setRatingModal({
            isOpen: true,
            orderId,
            clientName: orderToComplete.clientName,
            orderToComplete,
          });
          return;
        }
      }

      await axios.patch(
        `https://fixoo-backend.onrender.com/api/v1/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Buyurtma holati yangilandi");
    } catch (err) {
      console.error("Statusni o‘zgartirishda xatolik:", err);
      toast.error("Statusni o‘zgartirishda xatolik yuz berdi");
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { orderId } = ratingModal;

      await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/ratings",
        {
          orderId,
          rating,
          comment,
          raterType: "specialist",
          targetType: "client",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await updateOrderStatus(orderId, "completed");

      setRatingModal({
        isOpen: false,
        orderId: "",
        clientName: "",
        orderToComplete: null,
      });

      toast.success("Buyurtma yakunlandi va baho yuborildi!");
    } catch (error) {
      console.error("Baho yuborishda xatolik:", error);
      toast.error("Baho yuborishda muammo yuz berdi");
    }
  };

  const handleRatingModalClose = () => {
    setRatingModal({
      isOpen: false,
      orderId: "",
      clientName: "",
      orderToComplete: null,
    });
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Kutilmoqda";
      case "accepted":
        return "Qabul qilingan";
      case "completed":
        return "Bajarilgan";
      case "cancelled":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  const newOrders = orders.filter((o) => o.status === "pending");
  const historyOrders = orders.filter((o) => o.status !== "pending");

  if (isLoading) {
    return (
      <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />
    );
  }
  console.log(orders)

  return (
    <div className="min-h-screen bg-gray-50">
      <div onClick={() => router.push(adds[1].serverLink)} className="fixed top-1/2 -translate-y-1/2 hidden lg:flex right-4 z-50">
        <div className="w-[350px] h-[760px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {adds[1]?.photoUrl && (
            <div className="relative w-full h-[480px]">
              <Image src={adds[1].photoUrl} fill alt="Reklama" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          <div className="flex-1 p-6 flex flex-col justify-between">
            <p className="text-black text-center relative z-10 text-xl font-bold leading-snug drop-shadow-lg">
              {adds[1]?.text || 'Reklama'}
            </p>
          </div>

        </div>
      </div>

      <div onClick={() => router.push(adds[0].serverLink)} className="fixed top-1/2 -translate-y-1/2 hidden lg:flex left-4 z-50">
        <div className="w-[350px] h-[760px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

          {adds[0]?.photoUrl && (
            <div className="relative w-full h-[480px]">
              <Image src={adds[0].photoUrl} fill alt="Reklama" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          <div className="flex-1 p-6 flex flex-col justify-between">
            <p className="text-black text-center  relative z-10 text-xl font-bold leading-snug drop-shadow-lg">
              {adds[0]?.text}
            </p>
          </div>

        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("navigation.orders")}
          </h1>
          <p className="text-gray-600">
            Mijozlardan kelgan buyurtmalarni boshqaring
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("new")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${activeTab === "new"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                  }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Yangi buyurtmalar</span>
                {pendingCount > 0 && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${activeTab === "new"
                      ? "bg-white text-teal-600"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${activeTab === "history"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                  }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Buyurtmalar tarixi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-gray-900">
              {totalOrders}
            </div>
            <div className="text-sm text-gray-600">Jami buyurtmalar</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <div className="text-sm text-gray-600">Yangi</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">
              {acceptedCount}
            </div>
            <div className="text-sm text-gray-600">Qabul qilingan</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {completedCount}
            </div>
            <div className="text-sm text-gray-600">Bajarilgan</div>
          </div>
        </div>

        {/* New Orders Tab */}
        {activeTab === "new" && (
          <>
            {newOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Yangi buyurtmalar yo'q
                </h3>
                <p className="text-gray-500">
                  Mijozlardan yangi buyurtmalar kelganda, ular shu yerda
                  ko'rinadi
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {newOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-400"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {order.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {order.clientName}
                          </h3>
                          <p className="text-gray-500">{order.clientPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Yangi buyurtma
                        </span>
                        {order.price && (
                          <span className="text-lg font-bold text-teal-600">
                            {order.price.toLocaleString()} so'm
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Xizmat
                        </label>
                        <p className="text-gray-900 font-medium">
                          {order.service}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sana
                        </label>
                        <p className="text-gray-900">{order.date}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vaqt
                        </label>
                        <p className="text-gray-900">{order.time}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manzil
                      </label>
                      <p className="text-gray-900">{order.address}</p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tavsif
                      </label>
                      <p className="text-gray-700">{order.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => window.open(`tel:${order.clientPhone}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>Qo'ng'iroq qilish</span>
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, "accepted")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Qabul qilish</span>
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Rad etish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Order History Tab */}
        {activeTab === "history" && (
          <>
            {historyOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Buyurtmalar tarixi bo'sh
                </h3>
                <p className="text-gray-500">
                  Qabul qilgan, bajargan yoki rad etgan buyurtmalar shu yerda
                  ko'rinadi
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {historyOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${order.status === "accepted"
                      ? "border-blue-400"
                      : order.status === "completed"
                        ? "border-green-400"
                        : "border-red-400"
                      }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {order.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {order.clientName}
                          </h3>
                          <p className="text-gray-500">{order.clientPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                        {order.price && (
                          <span className="text-lg font-bold text-teal-600">
                            {order.price.toLocaleString()} so'm
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Xizmat
                        </label>
                        <p className="text-gray-900 font-medium">
                          {order.service}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sana
                        </label>
                        <p className="text-gray-900">{order.date}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vaqt
                        </label>
                        <p className="text-gray-900">{order.time}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manzil
                      </label>
                      <p className="text-gray-900">{order.address}</p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tavsif
                      </label>
                      <p className="text-gray-700">{order.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => window.open(`tel:${order.clientPhone}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>Qo'ng'iroq qilish</span>
                      </button>

                      {order.status === "accepted" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "completed")
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Bajarildi deb belgilash</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleRatingModalClose}
        onSubmit={handleRatingSubmit}
        targetUserName={ratingModal.clientName}
        userType="client"
        orderId={ratingModal.orderId}
      />

      <ToastContainer />
    </div>
  );
}
