"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { professions } from "../../lib/profession-data";
import { regions, getDistricts } from "../../lib/location-data";
import HammerLoader from "../../components/HammerLoader";
import RatingModal from "../../components/RatingModal";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  region: string;
  district: string;
};

interface OrderHistory {
  id: string;
  specialistName: string;
  specialistPhone: string;
  service: string;
  address: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  description: string;
  price?: number;
  isRated?: boolean;
}

export default function SearchPage() {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"search" | "history">("search");

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [profession, setProfession] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState<
    { value: string; label: string }[]
  >([]);
  const [results, setResults] = useState<User[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Order history states
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    orderId: "",
    specialistName: "",
    orderToRate: null as OrderHistory | null,
  });

  // Modal for editing / sending new order (address & description)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] =
    useState<OrderHistory | null>(null);
  const [modalAddress, setModalAddress] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const [allMasters, setAllMasters] = useState<User[]>([]);

  // Check authentication & initial data
  useEffect(() => {
    const init = async () => {
      const userRole = localStorage.getItem("userRole");

      if (!userRole) {
        router.push("/");
        return;
      }

      // Clear old demo data
      localStorage.removeItem("clientOrderHistory");
      localStorage.removeItem("specialistOrders");
      localStorage.removeItem("ratings");

      setOrderHistory([]);

      try {
        // Ustalarni olish
        const mastersRes = await axios.get(
          "https://fixoo-backend.onrender.com/api/v1/masters/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setAllMasters(mastersRes.data.data || []);

        // 🆕 Buyurtmalarni olish
        const ordersRes = await axios.get("https://fixoo-backend.onrender.com/api/v1/orders/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        console.log(ordersRes)

        // API qaytaradigan formatni moslashtiramiz
        const ordersData = (ordersRes.data.data || []).map((order: any) => ({
          id: order.id,
          specialistName: order.master?.fullName || "Noma'lum usta",
          specialistPhone: order.master?.phone || "",
          service: order.service || order.master?.profession || "",
          address: order.address,
          date: order.date || "",
          time: order.time || "",
          status: order.status || "pending",
          description: order.description || "",
          price: order.price || undefined,
          isRated: order.isRated || false,
        }));

        setOrderHistory(ordersData);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
        toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
      }

      setIsLoading(false);
    };

    init();
  }, [router]);

  // Update districts when region changes
  useEffect(() => {
    if (region) {
      setDistricts(getDistricts(region));
      setDistrict("");
    } else {
      setDistricts([]);
      setDistrict("");
    }
  }, [region]);

  const handleSearch = async () => {
    const trimmedSearch = searchTerm.trim().toLowerCase();

    if (trimmedSearch && !profession && !region && !district) {
      const filtered = allMasters.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(trimmedSearch);
      });
      setResults(filtered);
      setHasSearched(true);
      return;
    }

    if (!profession || !region || !district) {
      alert(
        "Kasb, viloyat va tumanni tanlash majburiy (yoki faqat ism yozing)!"
      );
      return;
    }

    try {
      const response = await axios.get(
        `https://fixoo-backend.onrender.com/api/v1/masters?profession=${profession}&region=${region}&district=${district}`
      );
      const allUsers = response.data.data;
      const filteredUsers = allUsers.filter((user: User) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(trimmedSearch);
      });
      setResults(filteredUsers);
      setHasSearched(true);
    } catch (error) {
      console.error("Qidiruvda xatolik:", error);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setProfession("");
    setRegion("");
    setDistrict("");
    setResults([]);
    setHasSearched(false);
  };

  // Sahifada buyurtma qilish tugmasi bosilganda (yangi buyurtma)
  const orderSpecialist = (user: User) => {
    // Agar siz xohlasangiz, bu ham modal ochadi
    const newOrder: OrderHistory = {
      id: user.id, // vaqtinchalik id
      specialistName: `${user.firstName} ${user.lastName}`,
      specialistPhone: user.phone,
      service:
        professions.find((p) => p.value === user.profession)?.label || "",
      address: "",
      date: "", // agar kerak bo‘lsa default
      time: "",
      status: "pending",
      description: "",
    };
    setSelectedOrderForModal(newOrder);
    setModalAddress("");
    setModalDescription("");
    setIsOrderModalOpen(true);
  };

  // Buyurtmalarning tarixidan tahrirlash/modal ochish
  const openOrderModal = (order: OrderHistory) => {
    setSelectedOrderForModal(order);
    setModalAddress(order.address);
    setModalDescription(order.description);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrderForModal(null);
  };

  const submitOrder = async () => {
    if (!selectedOrderForModal) return;

    try {
      // POST so‘rov yuborish
      const payload = {
        masterId: selectedOrderForModal.id,
        address: modalAddress,
        description: modalDescription,
        // qo‘shimcha maydonlar kerak bo‘lsa qo‘shing
      };

      const response = await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/orders",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log(response)

      // Faraz qilaylik, API bizga yangi buyurtma objectini qaytaradi:
      const createdOrder: OrderHistory = response.data.data;

      // Yangi buyurtmani orderHistory ga qo‘shish
      setOrderHistory((prev) => [...prev, createdOrder]);
      toast.success("Buyurtma muvaffaqiyatli berildi", { autoClose: 3000 });

      closeOrderModal();
    } catch (error) {
      console.error("Buyurtma yuborishda xatolik:", error);
      toast.error("Buyurtma yuborishda xatolik yuz berdi");
    }
  };

  const getStatusColor = (status: OrderHistory["status"]) => {
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

  const getStatusText = (status: OrderHistory["status"]) => {
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

  const handleRateSpecialist = (order: OrderHistory) => {
    setRatingModal({
      isOpen: true,
      orderId: order.id,
      specialistName: order.specialistName,
      orderToRate: order,
    });
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      const ratingData = {
        orderId: ratingModal.orderId,
        raterType: "client",
        targetType: "specialist",
        targetUserId: ratingModal.orderToRate?.specialistPhone,
        targetUserName: ratingModal.specialistName,
        rating,
        comment,
        timestamp: new Date().toISOString(),
      };

      console.log("Rating data:", ratingData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedHistory = orderHistory.map((order) =>
        order.id === ratingModal.orderId ? { ...order, isRated: true } : order
      );
      setOrderHistory(updatedHistory);

      setRatingModal({
        isOpen: false,
        orderId: "",
        specialistName: "",
        orderToRate: null,
      });

      toast.success("Baho muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  };

  const handleRatingModalClose = () => {
    setRatingModal({
      isOpen: false,
      orderId: "",
      specialistName: "",
      orderToRate: null,
    });
  };

  if (isLoading) {
    return (
      <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${activeTab === "search"
                    ? "bg-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                  }`}
              >
                {t("navigation.specialist_search")}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${activeTab === "history"
                    ? "bg-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                  }`}
              >
                Buyurtmalar tarixi
              </button>
            </div>
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("navigation.specialist_search")}
              </h1>
              <p className="text-gray-600">
                Kerakli ustani toping va buyurtma bering
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {t("profession")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                    required
                  >
                    <option value="">{t("select_profession")}</option>
                    {professions.map((prof) => (
                      <option key={prof.value} value={prof.value}>
                        {prof.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {t("region")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                    required
                  >
                    <option value="">{t("select_region")}</option>
                    {regions.map((reg) => (
                      <option key={reg.value} value={reg.value}>
                        {reg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {t("district")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                    required
                    disabled={!region}
                  >
                    <option value="">{t("select_district")}</option>
                    {districts.map((dist) => (
                      <option key={dist.value} value={dist.value}>
                        {dist.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font medium mb-1 text-gray-700">
                    {t("first_name")}, {t("last_name")} (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ism yoki familiya..."
                    className="w-full bg-gray-50 border-0 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition-colors duration-200 font-medium"
                >
                  {t("search")}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-initial bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Tozalash
                </button>
              </div>

              <p className="text-sm text-red-600 mt-3">* Majburiy maydonlar</p>
            </div>

            {hasSearched && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Qidiruv natijalari ({results.length} ta usta topildi)
                </h2>

                {results.length === 0 ? (
                  <div className="text-center py-12">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <div className="text-gray-500 text-lg mb-2">
                      Sizning qidiruvingiz bo'yicha ustalar topilmadi
                    </div>
                    <p className="text-gray-400">
                      Boshqa filtrlarni sinab ko'ring
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((user, index) => (
                      <div

                        key={index}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-teal-600">
                              {
                                professions.find(
                                  (p) => p.value === user.profession
                                )?.label
                              }
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>
                            <span className="font-medium">{t("region")}:</span>{" "}
                            {user.region}
                          </p>
                          <p>
                            <span className="font-medium">
                              {t("district")}:
                            </span>{" "}
                            {user.district}
                          </p>
                          {/* <p>
                              <span className="font-medium">{t("phone")}:</span>{" "}
                              {user.phone}
                            </p> */}
                        </div>

                        <div className="flex gap-2">
                          {/* <button
                              onClick={() => window.open(`tel:${user.phone}`)}
                              className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                            >
                              {t("phone")}
                            </button> */}
                          <button
                            onClick={() => orderSpecialist(user)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            Buyurtma
                          </button>

                          <button
                            onClick={() => router.push(`/about_master/${user.id}`)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            Batafsil
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Order History Tab */}
        {activeTab === "history" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Buyurtmalar tarixi
              </h1>
              <p className="text-gray-600">
                Berilgan buyurtmalaringiz va ularning holati
              </p>
            </div>

            {orderHistory.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Hozircha buyurtmalar yo'q
                </h3>
                <p className="text-gray-500">
                  Ustalardan xizmat buyurtma qilganingizda, ular shu yerda
                  ko'rinadi
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => openOrderModal(order)}
                    className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:ring-2 ring-teal-300 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {order.specialistName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {order.specialistName}
                          </h3>
                          <p className="text-gray-500">
                            {order.specialistPhone}
                          </p>
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

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          window.open(`tel:${order.specialistPhone}`)
                        }
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium flex items-center space-x-2"
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

                      {order.status === "completed" && !order.isRated && (
                        <button
                          onClick={() => handleRateSpecialist(order)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium flex items-center space-x-2"
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
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          <span>Ustani baholang</span>
                        </button>
                      )}

                      {order.status === "completed" && order.isRated && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium">
                            Baholangan
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Buyurtma berish</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manzil
              </label>
              <input
                type="text"
                value={modalAddress}
                onChange={(e) => setModalAddress(e.target.value)}
                placeholder="Manzil kiriting"
                className="w-full bg-gray-50 rounded-md p-2 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tavsif
              </label>
              <textarea
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
                placeholder="Qisqacha ish bo'yicha tavsif kiriting"
                className="w-full h-40 bg-gray-50 rounded-md p-2 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeOrderModal}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Bekor qilish
              </button>
              <button
                onClick={submitOrder}
                className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white"
              >
                Buyurtma berish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleRatingModalClose}
        onSubmit={handleRatingSubmit}
        targetUserName={ratingModal.specialistName}
        userType="specialist"
        orderId={ratingModal.orderId}
      />

      <ToastContainer />
    </div>
  );
}
