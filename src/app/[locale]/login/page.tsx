"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HammerLoader from "../../components/HammerLoader";
import LangSwitch from "../../components/LangSwitch";
import PhoneInput from "../../components/PhoneInput";
import axios from "axios";

type UserRole = "MASTER" | "USER";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();

  const [role, setRole] = useState<UserRole>("MASTER");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const cleanPhone = phone.replace(/\s+/g, "");

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    return () => {};
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      setError("Telefon raqam va parolni kiriting");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/auth/login",
        {
          phone: cleanPhone,
          password,
        }
      );

      const user = await axios.get(
        "https://fixoo-backend.onrender.com/api/v1/my/profile",
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        }
      );

      if (user.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("justLoggedIn", "true");
        localStorage.setItem("userRole", user.data.data.role);

        // Redirect
        if (user.data.data.role === "MASTER") {
          router.push("/homespecialist");
        } else {
          router.push("/homeclient");
        }
      } else {
        setError(
          `${
            role === "MASTER" ? "Usta" : "Mijoz"
          } sifatida telefon raqam yoki parol notogri`
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Xatolik yuz berdi. Qaytadan urinib koring");
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleForgotPassword = () => {
    router.push(`/reset-password`);
  };

  if (isLoading) {
    return <HammerLoader fullScreen={true} showText={true} text="Kirish..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-700 px-4 py-4 sm:py-6">
      {/* Header with back button and language switch */}
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
          Orqaga
        </button>
        <LangSwitch />
      </div>

      {/* Main content - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-teal-900 mb-3">
              Kirish
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">
              {role === "MASTER"
                ? "Usta sifatida kirish"
                : "Mijoz sifatida kirish"}
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex mb-6 sm:mb-8 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              className={`flex-1 py-3 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
                role === "MASTER"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setRole("MASTER")}
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
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              Usta
            </button>
            <button
              type="button"
              className={`flex-1 py-3 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
                role === "USER"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setRole("USER")}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Mijoz
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Phone Number */}
            <PhoneInput value={phone} onChange={setPhone} required />

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("password")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-0 rounded-xl p-3 sm:py-4 pl-10 pr-12 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
                  required
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? "Kirish..." : "Kirish"}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors text-sm sm:text-base flex items-center justify-center gap-2 mx-auto"
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Parolni unutdingizmi?
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm sm:text-base">
                Hisobingiz yo'qmi?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-teal-600 hover:text-teal-700 font-medium transition-colors inline-flex items-center gap-1"
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Ro'yxatdan o'ting
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
