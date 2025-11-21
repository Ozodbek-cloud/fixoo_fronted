"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import HammerLoader from "../../components/HammerLoader";
import PhoneInput from "../../components/PhoneInput";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // const validatePasswords = () => {
  //   if (!newPassword || !confirmPassword) {
  //     setError("Iltimos, barcha maydonlarni to'ldiring");
  //     return false;
  //   }

  //   if (newPassword.length < 6) {
  //     setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
  //     return false;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setError("Parollar mos kelmayapti");
  //     return false;
  //   }

  //   return true;
  // };
   const clearPhone = phone.replace(/\s+/g, "");
  const handlePasswordReset = async () => {
    // if (!validatePasswords()) return;
    setIsLoading(true);
    try {
      
      // Send verification code via API
      const sendOtp = await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/verification/send",
        {
          type: "reset_password",
          phone: clearPhone,
        }
      );

      // Navigate to phone verification page
      router.push(
        `/verify-phone?phone=${encodeURIComponent(phone)}&purpose=reset_password`
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

    // setShowConfirmModal(true);
  };

  const handleConfirmChange = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Parol muvaffaqiyatli o'zgartirildi!");
      router.push("/login");
    } catch (error) {
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberedPassword = () => {
    setShowConfirmModal(false);
    router.push("/login");
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    // Clear inputs
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  if (isLoading) {
    return (
      <HammerLoader
        fullScreen={true}
        showText={true}
        text="SMS yuborilmoqda..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a1 1 0 00-1-1H8a1 1 0 00-1 1v10a1 1 0 001 1h6a1 1 0 001-1V7zM12 11v4m0 0l-2-2m2 2l2-2M10 6V5a2 2 0 012-2v0a2 2 0 012 2v1"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Yangi parol o'rnatish
            </h1>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* New Password */}
            <div className="mb-4">
              <PhoneInput value={phone} onChange={setPhone} required />
              {/* <label className="block text-sm font-medium text-gray-700 mb-2 mt-5">
                Yangi parol <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-0 rounded-xl p-3 pr-10 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
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
              <p className="text-xs text-gray-500 mt-1">Kamida 6 ta belgi</p> */}
            </div>

            {/* Confirm Password */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parolni tasdiqlang <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-0 rounded-xl p-3 pr-10 text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
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
            </div> */}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePasswordReset}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-teal-700 transition-all duration-200 transform hover:scale-105"
            >
              Raqamni tastiqlash
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Parolingizni eslab qoldingizmi?
              </h3>
              <p className="text-gray-600 mb-6">
                Shu parolda qolasizmi yoki o'zgartirasizmi?
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleRememberedPassword}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ha, eslab qoldim
                </button>
                <button
                  onClick={handleCancelModal}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Yo'q, o'zgartiraman
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
