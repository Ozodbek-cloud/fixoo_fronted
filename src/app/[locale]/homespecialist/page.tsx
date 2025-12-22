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
import StatusModal from "@/app/components/StatusModal";
interface addsInter {
  text: string,
  photoUrl: string,
  serverLink: string
}

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
  const [open, setOpen] = useState(false);
 

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


  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  // --- HANDLERS ---
  const openAvailabilityModal = () => setIsAvailabilityModalOpen(true);
  const closeAvailabilityModal = () => setIsAvailabilityModalOpen(false);

  const saveAvailability = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Avtorizatsiya ma'lumoti topilmadi. Iltimos, qayta kiring.", {
          position: "top-center",
        });
        router.push("/");
        return;
      }

      const newAvailability = !isAvailable; // Modal ochilganda tanlangan qiymatga qarab, yangi holatni hisoblaymiz.

      if (!newAvailability) {
        // === BAND QILISH (BUSY) ===
        // Backendga band ekanligini xabar berish
        await axios.patch(
          "https://fixoo-backend.onrender.com/api/v1/master/check/busy",
          {
            // Eslatma: vaqtlar bandlik davriga mos bo'lishi kerak. Hozir 1 soatga band qilinmoqda.
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            IsBusy: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Siz band qilindingiz!", { position: "top-center" });
      } else {
        // === BANDLIKNI BEKOR QILISH (CANCEL BUSY) ===
        // Bandlikni bekor qilish
        await axios.patch(
          "https://fixoo-backend.onrender.com/api/v1/master/busy/cancel",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        toast.success("Bandlik bekor qilindi!", { position: "top-center" });
      }

      // Backend bilan muvaffaqiyatli aloqadan so'ng Frontend holatini yangilash
      setIsAvailable(newAvailability);
      localStorage.setItem("isAvailable", newAvailability.toString());

      closeAvailabilityModal();
    } catch (error) {
      console.error("Bandlik sozlashda xatolik:", error);
      toast.error("Bandlik sozlashda xatolik yuz berdi!", {
        position: "top-center",
      });
    }
  };

  const handleFixooAnimationComplete = useCallback(async () => {
    setShowFixooAnimation(false);

    try {
      const response = await axios.get(
        "https://fixoo-backend.onrender.com/api/v1/my/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const parsedData = response.data.data;
      setUserData(parsedData);
      setIsLoading(false);

      const available = localStorage.getItem("isAvailable");
      // Agar isAvailable qiymati localStorage da mavjud bo'lmasa, true deb qabul qilamiz
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
        const response = await axios.get(
          "https://fixoo-backend.onrender.com/api/v1/my/files",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

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
        // Kirish xabarini faqat kerak bo'lsa ko'rsatish
        // toast.success(`${t("welcome_back")}, ${userData?.firstName || "usta"}!`, ...);
        localStorage.removeItem("justLoggedIn");
      }
    };

    fetchProfileFiles();
  }, [router, t, handleFixooAnimationComplete]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        // "files" backend kutayotgan field nomi bo'lishi kerak
        formData.append("files", file);
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
        // Fayl input qiymatini tozalash
        event.target.value = "";
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
      await axios.delete(
        `https://fixoo-backend.onrender.com/api/v1/files/${fileToRemove.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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

        <div onClick={() => router.push(adds[1].serverLink)} className="fixed top-1/2 -translate-y-1/2 hidden lg:flex left-4 z-50">
          <div className="w-[350px] h-[680px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

            {adds[1]?.photoUrl && (
              <div className="relative w-full h-[480px]">
                <Image
                  src={adds[1].photoUrl}
                  fill
                  alt="Reklama"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            )}

            <div className="flex-1 p-6 flex flex-col justify-between">
              <p className="text-black text-center  relative z-10 text-xl font-bold leading-snug drop-shadow-lg">
                {adds[1]?.text}
              </p>
            </div>

          </div>
        </div>



        <div onClick={() => router.push(adds[0].serverLink)} className="fixed top-1/2 -translate-y-1/2 hidden lg:flex right-4 z-50">
          <div className="w-[350px] h-[680px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {adds[0]?.photoUrl && (
              <div className="relative w-full h-[480px]">
                <Image src={adds[0].photoUrl} fill alt="Reklama" className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            )}

            <div className="flex-1 p-6 flex flex-col justify-between">
              <p className="text-black text-center relative z-10 text-xl font-bold leading-snug drop-shadow-lg">
                {adds[0]?.text || 'Reklama'}
              </p>
            </div>

          </div>
        </div>

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

            <div className="flex items-center space-x-3">
              {/* <button
                onClick={openAvailabilityModal}
                // Haqiqiy tugma BG ni moslash uchun o'zgartirdim, chunki tashqi div oq rangda edi
                className="bg-teal-500/20 backdrop-blur-sm px-4 py-2 rounded-lg text-teal-700 text-sm hover:bg-teal-500/30 transition font-medium"
              >
                Bandlikni to‘g‘irlash
              </button> */}

              <div className="p-10">
                <button
                  onClick={() => setOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-green-400 hover:opacity-80 text-white font-bold transition-all duration-200"
                >
                  Bandlikni Boshqarish
                </button>

                <StatusModal open={open} onClose={() => setOpen(false)} />
              </div>
            </div>
          </div>
        </div>

        {/* {isAvailabilityModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-72 space-y-4">
              <h2 className="text-lg font-semibold">Bandlikni to‘g‘irlash</h2>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(!isAvailable)}
                />
                <label className="text-sm">
                  {isAvailable ? "Faolman (Mijozlar topishi mumkin)" : "Bandman (Mijozlar topa olmaydi)"}
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeAvailabilityModal}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={saveAvailability}
                  className="px-3 py-1 rounded bg-teal-500 text-white hover:bg-teal-600 transition"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )} */}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {portfolioFiles.map((file, index) => {
                const fileUrl = ``;
                const isImage = file.fileType === "image";
                const isVideo = file.fileType === "video";
                const isPDF = file.fileType === "pdf";

                return (
                  <div
                    key={file.id || index}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-center w-full h-40 bg-gray-100 p-2">
                      {isImage ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={fileUrl}
                            alt="Image"
                            fill
                            style={{ objectFit: "cover" }}
                            className="w-full h-full"
                            priority
                          />
                        </div>
                      ) : isVideo ? (
                        <video
                          controls
                          className="w-full h-full object-cover"
                          src={fileUrl}
                        />
                      ) : isPDF ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-700 flex flex-col items-center p-4 hover:text-teal-900 transition"
                          >
                            <svg
                              className="w-8 h-8 mb-2"
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
                            <span className="text-xs font-medium">PDF-ni ochish</span>
                          </a>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 flex flex-col items-center p-4 hover:text-teal-800 transition"
                          >
                            <svg
                              className="w-8 h-8 mb-2"
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
                            <span className="text-xs font-medium">Faylni ochish</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Hoverda chiqadigan o‘chirish tugmasi */}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute right-2 top-2 text-white bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow hover:bg-red-700"
                      aria-label="Faylni o'chirish"
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
                Hozircha <strong>portfolio fayllari yo'q</strong>
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
