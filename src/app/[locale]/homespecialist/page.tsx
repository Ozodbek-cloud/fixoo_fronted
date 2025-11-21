"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProfessionLabel } from "../../lib/profession-data";
import { regions, getDistricts } from "../../lib/location-data";
import HammerLoader from "../../components/HammerLoader";
import LoadingAnimation from "../../components/LoadingAnimation";
import axios from "axios";
import Image from "next/image";

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

type PortfolioFile = {
  id: string;
  fileType: string;
  fileUrl: string;
  userId: string;
  createdAt: string;
};

export default function SpecialistHomePage() {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [showFixooAnimation, setShowFixooAnimation] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);

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

      const available = localStorage.getItem("isAvailable");
      setIsAvailable(available === "false" ? false : true);
    } catch (error) {
      console.error("Profilni yuklashda xatolik:", error);
      toast.error("Profilni yuklashda xatolik yuz berdi.");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchProfileFiles = async () => {
      const userRole = localStorage.getItem("userRole");

      if (userRole !== "MASTER") {
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
        await handleFixooAnimationComplete();
      }

      try {
        const response = await axios.get("https://fixoo-backend.onrender.com/api/v1/my/files", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const savedFiles = response.data.data;
        if (savedFiles) {
          setPortfolioFiles(savedFiles);
        }
      } catch (err) {
        console.error("Fayllarni olishda xatolik:", err);
      }

      const justRegistered = localStorage.getItem("justRegistered");
      const justLoggedIn = localStorage.getItem("justLoggedIn");

      if (justRegistered === "true") {
        toast.success(
          `${t("welcome")} Fixoo'ga! Profilingiz faollashtirildi.`,
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
        localStorage.removeItem("justRegistered");
      } else if (justLoggedIn === "true") {
        localStorage.removeItem("justLoggedIn");
      }
    };

    fetchProfileFiles();
  }, [router, t, handleFixooAnimationComplete]);

  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    localStorage.setItem("isAvailable", newStatus.toString());

    toast.success(
      newStatus
        ? `${t("available")} - Mijozlar sizni topishi mumkin`
        : `${t("unavailable")} - Mijozlar sizni topa olmaydi`,
      {
        position: "top-center",
        autoClose: 2000,
      }
    );
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file); // "files" backend kutayotgan field nomi bo'lishi kerak
      });

      try {
        const response = await axios.post(
          "https://fixoo-backend.onrender.com/api/v1/files",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploadedFiles: PortfolioFile[] = response.data.files;
        setPortfolioFiles((prev) => [...prev, ...uploadedFiles]);

        toast.success(
          `${uploadedFiles.length} ta fayl muvaffaqiyatli yuklandi`,
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
      } catch (error) {
        console.error("Fayl yuklashda xatolik:", error);
        toast.error("Fayl yuklashda xatolik yuz berdi.", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  const removeFile = async (index: number) => {
    const fileToRemove = portfolioFiles[index];

    try {
      // Backenddan faylni o'chirish
      await axios.delete(`https://fixoo-backend.onrender.com/api/v1/files/${fileToRemove.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Fayl o'chirilganidan so'ng state va localStorage-ni yangilash
      const updatedFiles = portfolioFiles.filter((_, i) => i !== index);
      setPortfolioFiles(updatedFiles);

      toast.info("Fayl o'chirildi", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Faylni o'chirishda xatolik:", error);
      toast.error("Faylni o'chirishda xatolik yuz berdi", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  if (showFixooAnimation) {
    return <LoadingAnimation onComplete={handleFixooAnimationComplete} />;
  }

  if (isLoading) {
    return (
      <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />
    );
  }

  if (!userData) {
    return null;
  }

  const getRegionLabel = (value: string) => {
    const region = regions.find((r) => r.value === value);
    return region ? region.label : value;
  };

  const getDistrictLabel = (regionValue: string, districtValue: string) => {
    const districts = getDistricts(regionValue);
    const district = districts.find((d) => d.value === districtValue);
    return district ? district.label : districtValue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData?.firstName?.charAt(0)}
                {userData?.lastName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("welcome_user")}, {userData.firstName}!
                </h1>
                <p className="text-gray-600">{t("professional_profiling")}</p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAvailable ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm font-medium text-white">
                  {isAvailable ? "Faolman" : "Band"}
                </span>
              </div>
              <button
                onClick={toggleAvailability}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 ${
                  isAvailable ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    isAvailable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t("profile")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("your_profession")}
                </label>
                <p className="text-gray-900 font-medium">
                  {getProfessionLabel(userData.profession)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("your_region")}
                </label>
                <p className="text-gray-900">
                  {getRegionLabel(userData.region)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("district")}
                </label>
                <p className="text-gray-900">
                  {getDistrictLabel(userData.region, userData.district)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("your_phone")}
                </label>
                <p className="text-gray-900 font-medium">{userData.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("your_address")}
                </label>
                <p className="text-gray-900">{userData.add_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              {t("portfolio")}
            </h2>

            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="portfolio-upload"
              />
              <label
                htmlFor="portfolio-upload"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-teal-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>{t("upload")}</span>
              </label>
            </div>
          </div>

          {/* Portfolio Files */}
          {portfolioFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {portfolioFiles.map((file, index) => {
                const fileUrl = `https://fixoo-backend.onrender.com/${file.fileType}/${file.fileUrl}`;
                const isImage = file.fileType === "image";
                const isVideo = file.fileType === "video";
                const isPDF = file.fileType === "pdf";
                
                return (
                  <div
                    key={file.id || index}
                    className="relative group rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 w-full">
                      {isImage ? (
                        <Image
                          src={fileUrl}
                          alt="Image"
                          width={600}
                          height={600}
                          className="w-full h-58 rounded object-cover"
                          priority
                        />
                      ) : isVideo ? (
                        <video
                          controls
                          className="w-full h-58 rounded object-cover"
                          src={fileUrl}
                        />
                      ) : isPDF ? (
                        <div className="w-full h-58 bg-teal-100 rounded flex items-center justify-center">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-700 flex flex-col items-center"
                          >
                            <svg
                              className="w-6 h-6 mb-1"
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
                            <span className="text-xs">PDF-ni ochish</span>
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-58 bg-teal-100 rounded flex items-center justify-center">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 flex flex-col items-center"
                          >
                            <svg
                              className="w-6 h-6 mb-1"
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
                            <span className="text-xs">Faylni ochish</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Hoverda chiqadigan o‘chirish tugmasi */}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute right-2 top-2 text-white bg-teal-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-500 mb-4">
                Hozircha portfolio fayllari yo'q
              </p>
              <p className="text-sm text-gray-400">
                Ishlaringizni ko'rsatish uchun rasm, video yoki hujjat yuklang
              </p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
