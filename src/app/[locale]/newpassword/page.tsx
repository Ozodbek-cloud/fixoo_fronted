"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HammerLoader from "@/app/components/HammerLoader";
import axios from "axios";
// Heroicons importlari qo'shildi
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  // Muvaffaqiyat xabari matni yangilandi
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // localStorage-dan ma'lumotlarni olish
  const otp = localStorage.getItem("code");
  const phone = localStorage.getItem("phone");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Ikkala parolni ham kiriting");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parollar mos kelmadi");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/auth/reset-password",
        { password, otp, phone }
      );
      setIsLoading(false);
      // Muvaffaqiyat xabari yangilandi
      setSuccess("Parol muvaffaqiyatli yangilandi! Endi tizimga kirishingiz mumkin.");
      // 2 soniyadan so‘ng login sahifaga yo‘naltirish
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Parolni o'zgartirishda xatolik yuz berdi");
    }
  };

  if (isLoading) {
    return (
      <HammerLoader
        fullScreen={true}
        showText={true}
        text="Yangi parol saqlanmoqda..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Yangi parol yaratish
            </h1>
            <p className="text-teal-100">
              Iltimos, tizimga kirish uchun yangi parolingizni kiriting.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col gap-4">
            {/* Yangi parol kiritish maydoni */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Yangi parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 pr-10" // pr-10 ikona uchun joy
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800 transition duration-150"
                aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {/* Heroicons ikonkalari */}
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Parolni tasdiqlash maydoni */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Parolni tasdiqlang"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 pr-10" // pr-10 ikona uchun joy
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800 transition duration-150"
                aria-label={showConfirmPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {/* Heroicons ikonkalari */}
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Xato Xabari */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Muvaffaqiyat Xabari (Yangi matn bilan) */}
            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center font-medium">
                {success}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
            >
              Saqlash
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-teal-600 text-sm transition duration-150"
              >
                ← Orqaga qaytish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPasswordPage;