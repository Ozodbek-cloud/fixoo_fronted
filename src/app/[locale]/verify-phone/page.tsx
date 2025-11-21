"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import HammerLoader from "../../components/HammerLoader";
import axios from "axios";

export default function VerifyPhonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [code, setCode] = useState(["", "", "", "", "", ""]); // 6 ta input uchun
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneNumber = searchParams.get("phone");
  const purpose = searchParams.get("purpose");

  useEffect(() => {
    // Start resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newCode.every((digit) => digit)) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData
        .split("")
        .concat(Array(6 - pastedData.length).fill(""));
      setCode(newCode);

      const nextEmptyIndex = newCode.findIndex((digit) => !digit);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();

        handleVerify(newCode.join(""));
      }
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const verificationCode = fullCode || code.join("");

    if (verificationCode.length !== 6) {
      setError("Iltimos, 6 xonali kodni to'liq kiriting");
      return;
    }

    setIsLoading(true);

    const clearPhone = phoneNumber?.replace(/\s+/g, "");
    console.log(clearPhone, purpose, verificationCode); 

    try {
      // 1. Avval OTP ni tekshiramiz
      const verifyResponse = await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/verification/verify",
        {
          type: 'reset_password',
          otp:verificationCode,
          phone: clearPhone,
        }
      );

      if (verifyResponse.data.success) {
        if (purpose === "register") {
          const formDataRaw = localStorage.getItem("FormData");

          if (formDataRaw) {
            const formData = JSON.parse(formDataRaw);

            formData.otp = verificationCode;

            const userRole = localStorage.getItem("userRole");
            let registerResponse: any;


            try {
              if (userRole === "MASTER") {
                registerResponse = await axios.post(
                  "https://fixoo-backend.onrender.com/api/v1/auth/register",
                  formData
                );
              } else if (userRole === "USER") {
                registerResponse = await axios.post(
                  "https://fixoo-backend.onrender.com/api/v1/auth/register",
                  {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    password: formData.password,
                    otp: verificationCode,
                  }
                );

              } else {
                throw new Error("Noto'g'ri foydalanuvchi turi");
              }

              if (registerResponse?.data?.accessToken) {
                localStorage.setItem(
                  "accessToken",
                  registerResponse.data.accessToken
                );
                localStorage.setItem(
                  "refreshToken",
                  registerResponse.data.refreshToken
                );
                localStorage.setItem("justRegistered", "true");
                localStorage.removeItem("FormData");

                if (userRole === "MASTER") {
                  router.push("/homespecialist");
                } else {
                  router.push("/homeclient");
                }
              } else {
                setError(
                  registerResponse?.data?.message || "Ro'yxatdan o'tishda xatolik"
                );
              }
            } catch (registrationError: any) {
              console.error("Registration error:", registrationError);
              setError(
                registrationError.response?.data?.message ||
                "Ro'yxatdan o'tishda xatolik yuz berdi"
              );
            }
          } else {
            setError("Ma'lumotlar topilmadi. Iltimos, qayta urinib ko‘ring.");
            router.push("/register");
          }
        } else if (purpose === "reset-password") {
          router.push(
            `/reset-password?phone=${encodeURIComponent(
              phoneNumber || ""
            )}&verified=true`
          );
        }
      } else {
        setError(
          verifyResponse.data.message || "Noto'g'ri kod. Qayta urinib ko‘ring."
        );
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const message =
        error.response?.data?.message ||
        "Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError(""); // Clear any errors
    setCode(["", "", "", "", "", ""]); // Clear kod inputlarini

    try {
      await axios.post("https://fixoo-backend.onrender.com/api/v1/verification/send", {
        type: purpose,
        phone: phoneNumber
      });
      alert("Yangi kod yuborildi!");
    } catch (error: any) {
      console.error("Resend error:", error);
      setError("Kod yuborishda xatolik. Qaytadan urinib ko'ring");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  if (isLoading) {
    return (
      <HammerLoader
        fullScreen={true}
        showText={true}
        text="Tekshirilmoqda..."
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Telefon raqamni tasdiqlash
            </h1>
            <p className="text-teal-100">
              {phoneNumber} raqamiga yuborilgan 6 xonali kodni kiriting
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Code Input Fields */}
            <div className="flex justify-center space-x-2 mb-6">
              {" "}
              {/* space'ni kamaytirildi chunki 6 ta input */}
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 ${error
                    ? "border-red-500 bg-red-50"
                    : digit
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300 focus:border-teal-500 focus:bg-teal-50"
                    }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={code.some((digit) => !digit) || isLoading}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 mb-4"
            >
              Tasdiqlash
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Kod kelmadimi?{" "}
                {canResend ? (
                  <button
                    onClick={handleResendCode}
                    className="text-teal-600 hover:text-teal-700 font-medium underline"
                  >
                    Qayta yuborish
                  </button>
                ) : (
                  <span className="text-gray-500">
                    {resendTimer} soniyadan keyin qayta yuborish mumkin
                  </span>
                )}
              </p>
            </div>

            {/* Back Link */}
            <div className="text-center mt-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 text-sm"
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
