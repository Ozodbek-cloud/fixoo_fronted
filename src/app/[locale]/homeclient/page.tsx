"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HammerLoader from "../../components/HammerLoader";
import LoadingAnimation from "../../components/LoadingAnimation";
import axios from "axios";

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
};

export default function ClientHomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showFixooAnimation, setShowFixooAnimation] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);

  const handleFixooAnimationComplete = useCallback(async () => {
    setShowFixooAnimation(false);

    try {
      const response = await axios.get("https://fixoo-backend.onrender.com/api/v1/my/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const parsedData = response.data.data;
      setUserData(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Profilni yuklashda xatolik:", error);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "USER") {
      router.push("/");
      return;
    }

    const hasSeenFixooAnimation = sessionStorage.getItem(
      "fixoo_specialist_seen"
    );

    if (!hasSeenFixooAnimation) {
      sessionStorage.setItem("fixoo_specialist_seen", "true");
      setShowFixooAnimation(true);
    } else {
      handleFixooAnimationComplete();
    }

    const justRegistered = localStorage.getItem("justRegistered");
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (justRegistered === "true") {
      localStorage.removeItem("justRegistered");
    } else if (justLoggedIn === "true") {
      localStorage.removeItem("justLoggedIn");
    }
  }, [router, handleFixooAnimationComplete]);

  if (showFixooAnimation) {
    return <LoadingAnimation onComplete={handleFixooAnimationComplete} />;
  }

  if (isLoading) {
    return (
      <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Ma&apos;lumotlar topilmadi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Fixoo Branding */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Fixoo
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional ustalarni topish va ulardan xizmat olish uchun eng
            qulay platforma
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-teal-600 text-2xl font-bold">
                {userData.firstName.charAt(0)}
                {userData.lastName.charAt(0)}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Xush kelibsiz, {userData.firstName}!
            </h2>
            <p className="text-gray-600">
              Kerakli ustani toping va professional xizmat oling
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Search Specialists Card */}
          <div
            onClick={() => router.push("/searchspecialist")}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-teal-600"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Usta qidirish
              </h3>
              <p className="text-gray-600 text-sm">
                Kerakli ustani toping va bog'laning
              </p>
            </div>
          </div>

          {/* Settings Card */}
          <div
            onClick={() => router.push("/setting")}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sozlamalar
              </h3>
              <p className="text-gray-600 text-sm">
                Profil va hisobni boshqaring
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Qanday ishlaydi?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Qidiring</h4>
              <p className="text-sm text-gray-600">
                Kerakli ustani kasbi va joylashuvi bo'yicha toping
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bog'laning</h4>
              <p className="text-sm text-gray-600">
                To'g'ridan-to'g'ri usta bilan bog'lanib kelishing
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Xizmat oling</h4>
              <p className="text-sm text-gray-600">
                Professional va sifatli xizmat oling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
