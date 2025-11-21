"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { professions } from "../../lib/profession-data";
import { regions, getDistricts } from "../../lib/location-data";
import LangSwitch from "../../components/LangSwitch";
import PhoneInput from "../../components/PhoneInput";
import axios from "axios";
import HammerLoader from "../../components/HammerLoader";

type UserRole = "MASTER" | "USER";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  profession: string;
  add_address: string;
  region: string;
  district: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as UserRole;
  const t = useTranslations();

  const [role, setRole] = useState<UserRole>(roleParam || "MASTER");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const rol = localStorage.getItem("userRole");

    if (token && rol === "MASTER") {
      router.push("/homespecialist");
    } else if (token && rol === 'USER') {
      router.push("/homeclient");
    }
  }, [router]);


  const [districts, setDistricts] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (roleParam) {
      setRole(roleParam);
    }
  }, [roleParam]);

  useEffect(() => {
    if (formData.region) {
      const newDistricts = getDistricts(formData.region);
      setDistricts(newDistricts);
    } else {
      setDistricts([]);
    }
  }, [formData.region]);

  useEffect(() => {
    const handleComplete = () => setIsLoading(false);

    return () => { };
  }, []);

  // Form validation function
  const isFormValid = () => {
    if (role === "MASTER") {
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.profession.trim() !== "" &&
        formData.add_address.trim() !== "" &&
        formData.region.trim() !== "" &&
        formData.district.trim() !== ""
      );
    } else {
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.password.trim() !== ""
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert(t("fill_all_fields"));
      return;
    }

    const allUsersRaw = localStorage.getItem("users") || "[]";
    const allUsers = JSON.parse(allUsersRaw) as FormData[];

    const isPhoneExists = allUsers.some(
      (user) => user.phone === formData.phone
    );

    if (isPhoneExists) {
      alert(t("phone_already_registered"));
      return;
    }

    // Save form data temporarily for phone verification
    const userDataWithRole = { ...formData, role }; // Add role to form data
    localStorage.setItem("FormData", JSON.stringify(userDataWithRole));
    localStorage.setItem("userRole", role);

    setIsLoading(true);
    try {
      // Send verification code via API
      const sendOtp = await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/verification/send",
        {
          type: "register",
          phone: formData.phone,
        }
      );

      // Navigate to phone verification page
      router.push(
        `/verify-phone?phone=${encodeURIComponent(
          formData.phone
        )}&purpose=register`
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || t("error_sending_otp");
        alert(errorMessage);
      } else {
        alert(t("network_error"));
      }
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <HammerLoader
        fullScreen={true}
        showText={true}
        text="Ro'yxatga olinmoqda..."
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-700 px-4 py-4 sm:py-6">
      {/* Header with back button and language switch - Fixed positioning */}
      <div className="w-full max-w-2xl mx-auto flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="text-white hover:text-gray-200 flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("back")}
        </button>
        <LangSwitch />
      </div>

      {/* Main content - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full border border-white/20">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-teal-900 mb-3">
              Fixoo
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">
              {role === "MASTER"
                ? t("auth.specialist_description")
                : t("auth.client_description")}
            </p>
          </div>

          <div className="flex mb-6 sm:mb-8 bg-gray-100 rounded-xl p-1">
            <button
              className={`flex-1 py-3 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base ${role === "MASTER"
                ? "bg-teal-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setRole("MASTER")}
            >
              {t("specialist")}
            </button>
            <button
              className={`flex-1 py-3 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base ${role === "USER"
                ? "bg-teal-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setRole("USER")}
            >
              {t("client")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Ism va Familiya - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("first_name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t("first_name")}
                  className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("last_name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t("last_name")}
                  className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                  required
                />
              </div>
            </div>

            {/* Telefon va Parol - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhoneInput
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone: value }))
                }
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("password")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("password")}
                    className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 pr-12 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
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
                    ) : (
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878m4.242 4.242L16.535 16.535"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Usta uchun qo'shimcha maydonlar */}
            {role === "MASTER" && (
              <>
                {/* Kasb va Manzil - responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("select_profession")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer shadow-md focus:shadow-lg"
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        {t("select_profession")}
                      </option>
                      {professions.map((prof) => (
                        <option
                          key={prof.value}
                          value={prof.value}
                          className="text-gray-900"
                        >
                          {prof.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("living_address")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="add_address"
                      value={formData.add_address}
                      onChange={handleChange}
                      placeholder={t("living_address")}
                      className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                      required
                    />
                  </div>
                </div>

                {/* Viloyat va Tuman - responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("select_region")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer shadow-md focus:shadow-lg"
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        {t("select_region")}
                      </option>
                      {regions.map((region) => (
                        <option
                          key={region.value}
                          value={region.value}
                          className="text-gray-900"
                        >
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("select_district")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:p-4 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md focus:shadow-lg"
                      required
                      disabled={!formData.region}
                    >
                      <option value="" disabled className="text-gray-400">
                        {!formData.region
                          ? t("select_district_first")
                          : t("select_district")}
                      </option>
                      {districts.map((district) => (
                        <option
                          key={district.value}
                          value={district.value}
                          className="text-gray-900"
                        >
                          {district.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${isFormValid()
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-200 transform hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {t("create_account")}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {t("already_have_account")}{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-teal-700 font-medium hover:underline"
              >
                {t("login")}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Custom styles for better select appearance */}
      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 3rem;
        }

        select:focus {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2314b8a6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
