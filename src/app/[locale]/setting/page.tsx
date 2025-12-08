"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { professions } from "../../lib/profession-data";
import { regions, getDistricts } from "../../lib/location-data";
import HammerLoader from "../../components/HammerLoader";
import PhoneInput from "../../components/PhoneInput";
import axios from "axios";

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  profession: string;
  add_address: string;
  region: string;
  district: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    profession: "",
    add_address: "",
    region: "",
    district: "",
  });

  const [districts, setDistricts] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const role = localStorage.getItem("userRole");

      if (!role) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get("https://fixoo-backend.onrender.com/api/v1/my/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const parsedData = response.data.data;
        // const parsedData = JSON.parse(savedData);

        setUserData(parsedData);
        setUserRole(role);
        setFormData(parsedData);

        if (parsedData.region) {
          setDistricts(getDistricts(parsedData.region));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Profilni yuklashda xatolik:", error);
        toast.error("Profil ma'lumotlarini olishda xatolik yuz berdi.");
        router.push("/");
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (formData.region) {
      setDistricts(getDistricts(formData.region));
      if (formData.region !== userData?.region) {
        setFormData((prev) => ({ ...prev, district: "" }));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.region, userData?.region]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    // Validation
    if (userRole === "MASTER") {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone ||
        !formData.profession ||
        !formData.add_address ||
        !formData.region ||
        !formData.district
      ) {
        toast.error("Barcha majburiy maydonlarni to'ldiring!", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    } else {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone
      ) {
        toast.error("Barcha majburiy maydonlarni to'ldiring!", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      // Token olish (agar kerak bo‘lsa)
      const token = localStorage.getItem("accessToken");

      // So‘rov yuborish
      await axios.put("https://fixoo-backend.onrender.com/api/v1/my/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Muvoffaqiyatli yangilanganidan keyin
      setUserData(formData);
      setIsEditing(false);

      toast.success("Ma'lumotlar muvaffaqiyatli yangilandi!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error: any) {
      console.error("Profilni yangilashda xatolik:", error);

      const errorMessage =
        error.response?.data?.message || "Ma'lumotlarni yangilashda xatolik";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleCancelEdit = () => {
    setFormData(
      userData || {
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        profession: "",
        add_address: "",
        region: "",
        district: "",
      }
    );
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    // Remove from users array
    const allUsersRaw = await axios.delete(
      "https://fixoo-backend.onrender.com/api/v1/my/profile",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    // Clear current user data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAvailable");
    localStorage.removeItem("portfolioFiles");

    toast.success("Akkount muvaffaqiyatli o'chirildi!", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => {
        router.push("/");
      },
    });
  };

  if (isLoading) {
    return (
      <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600">Ma&apos;lumotlar topilmadi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-1/2 -translate-y-1/2 hidden lg:flex left-4 z-50">
        <div className="w-[440px] h-[700px] bg-white shadow-lg rounded-xl p-4 flex items-center justify-center">
          <span className="font-semibold text-gray-700">Reklama 1</span>
        </div>
      </div>

      <div className="fixed top-1/2 -translate-y-1/2 hidden lg:flex right-4 z-50">
        <div className="w-[440px] h-[700px] bg-white shadow-lg rounded-xl p-4 flex items-center justify-center">
          <span className="font-semibold text-gray-700">Reklama 2</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {t("settings")}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Profil sozlamalari va akkaunt boshqaruvi
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 sm:space-x-4 bg-white rounded-lg sm:rounded-xl p-1 shadow-md">
            <div className="flex-1 bg-teal-500 text-white text-center py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profil & Xavfli zona
            </div>
            <button
              onClick={() => router.push("/setting/support")}
              className="flex-1 text-gray-600 hover:text-teal-600 hover:bg-gray-50 text-center py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
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
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Qo'llab-quvvatlash
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Profil ma&apos;lumotlari
                    </h2>
                    <p className="text-xs sm:text-sm text-teal-100">
                      Shaxsiy ma&apos;lumotlaringizni boshqaring
                    </p>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Tahrirlash</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-6">
              {/* User Info Display */}
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-base sm:text-xl lg:text-2xl font-bold">
                  {userData.firstName.charAt(0)}
                  {userData.lastName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${userRole === "MASTER"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-blue-100 text-blue-800"
                        }`}
                    >
                      {userRole === "MASTER" ? "Usta" : "Mijoz"}
                    </span>
                    {userRole === "MASTER" && (
                      <>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          {
                            professions.find(
                              (p) => p.value === userData.profession
                            )?.label
                          }
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        {t("first_name")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        {t("last_name")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        {t("password")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 pr-10 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Specialist-specific fields */}
                  {userRole === "MASTER" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      {/* Profession */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          {t("profession")} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="profession"
                          value={formData.profession}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
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

                      {/* Address */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          {t("address")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.add_address}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                          required
                        />
                      </div>

                      {/* Region */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          {t("region")} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
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

                      {/* District */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          {t("district")} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                          required
                          disabled={!formData.region}
                        >
                          <option value="">{t("select_district")}</option>
                          {districts.map((dist) => (
                            <option key={dist.value} value={dist.value}>
                              {dist.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base font-medium flex items-center justify-center space-x-1 sm:space-x-2"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
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
                      <span>Saqlash</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base font-medium flex items-center justify-center space-x-1 sm:space-x-2"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
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
                      <span>Bekor qilish</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t("first_name")}
                      </label>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-900 font-medium">
                        {userData.firstName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t("phone")}
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">
                        {userData.phone}
                      </p>
                    </div>

                    {userRole === "MASTER" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("profession")}
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {professions.find(
                              (p) => p.value === userData.profession
                            )?.label || userData.profession}
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("region")}
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {regions.find((r) => r.value === userData.region)
                              ?.label || userData.region}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t("last_name")}
                      </label>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-900 font-medium">
                        {userData.lastName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t("password")}
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">
                        ••••••••
                      </p>
                    </div>

                    {userRole === "MASTER" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("address")}
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {userData.add_address}
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("district")}
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {getDistricts(userData.region).find(
                              (d) => d.value === userData.district
                            )?.label || userData.district}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Account Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-l-4 border-red-400">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Xavfli zona
                  </h2>
                  <p className="text-xs sm:text-sm text-red-100">
                    Akkaunt boshqaruvi
                  </p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  <strong>Diqqat:</strong> Akkauntni o'chirish qaytarib
                  bo'lmaydigan jarayon.
                </p>
                <p className="text-sm text-gray-600">
                  Barcha ma&apos;lumotlaringiz, buyurtmalar tarixi va portfolio
                  fayllari butunlay o&apos;chirib tashlanadi.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base font-medium flex items-center space-x-1 sm:space-x-2"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Akkauntni o'chirish</span>
                </button>
              ) : (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl border border-red-200">
                  <p className="text-sm sm:text-base text-red-800 font-medium">
                    ⚠️ Rostdan ham akkauntni o'chirmoqchimisiz? Bu jarayon
                    qaytarib bo'lmaydi!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base font-medium"
                    >
                      Ha, o'chirib tashlash
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-500 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base font-medium"
                    >
                      Yo'q, bekor qilish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
