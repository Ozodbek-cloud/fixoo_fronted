"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import {
    Camera,
    Video,
    FileText,
    Trash2,
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    Save,
    Briefcase,
    User,
    MapPin,
    Phone,
    Eye,
    EyeOff,
    Settings,
    X
} from "lucide-react";
import { toast } from "react-toastify";
import StatusModal from "./StatusModal";
import HammerLoader from "./HammerLoader";
import PhoneInput from "./PhoneInput";
import { professions } from "../lib/profession-data";
import { regions, getDistricts } from "../lib/location-data";

interface PortfolioFile {
    id: string;
    fileType: string;
    fileUrl: string;
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

export default function MasterProfile() {
    const [activeTab, setActiveTab] = useState<"profile" | "availability" | "portfolio">("profile");
    const [userData, setUserData] = useState<any>(null);
    const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [servicesText, setServicesText] = useState("");
    const [isSavingServices, setIsSavingServices] = useState(false);
    const [userRole, setUserRole] = useState<string>("");

    // Profile Form State
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
    const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const role = localStorage.getItem("userRole") || "";
        setUserRole(role);
        fetchProfile();
        fetchFiles();
        const savedServices = localStorage.getItem("masterServices");
        if (savedServices) setServicesText(savedServices);
    }, []);

    useEffect(() => {
        if (formData.region) {
            setDistricts(getDistricts(formData.region));
        } else {
            setDistricts([]);
        }
    }, [formData.region]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("https://fixoo-backend.onrender.com/api/v1/my/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.data;
            setUserData(data);
            setFormData(data);
            setIsAvailable(data.isAvailable !== false);
            if (data.region) {
                setDistricts(getDistricts(data.region));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("https://fixoo-backend.onrender.com/api/v1/my/files", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPortfolioFiles(response.data.data || []);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (userRole === "MASTER") {
            if (!formData.firstName || !formData.lastName || !formData.phone || !formData.profession || !formData.region || !formData.district) {
                toast.error("Barcha majburiy maydonlarni to'ldiring!");
                return;
            }
        } else {
            if (!formData.firstName || !formData.lastName || !formData.phone) {
                toast.error("Barcha majburiy maydonlarni to'ldiring!");
                return;
            }
        }

        try {
            const token = localStorage.getItem("accessToken");
            await axios.put("https://fixoo-backend.onrender.com/api/v1/my/profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(formData);
            setIsEditing(false);
            toast.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("fileType", type);

        try {
            const token = localStorage.getItem("accessToken");
            await axios.post("https://fixoo-backend.onrender.com/api/v1/files", uploadFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Fayl muvaffaqiyatli yuklandi");
            fetchFiles();
        } catch (error) {
            toast.error("Fayl yuklashda xatolik");
        }
    };

    const handleDeleteFile = async (id: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`https://fixoo-backend.onrender.com/api/v1/my/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Fayl o'chirildi");
            setPortfolioFiles(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            toast.error("Faylni o'chirishda xatolik");
        }
    };

    const handleSaveServices = () => {
        setIsSavingServices(true);
        localStorage.setItem("masterServices", servicesText);
        setTimeout(() => {
            setIsSavingServices(false);
            toast.success("Xizmatlar saqlandi");
        }, 500);
    };

    if (isLoading) return <HammerLoader />;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-teal-500 rounded-[2rem] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-teal-500/20">
                    {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {userData?.firstName} {userData?.lastName}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                        <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {userRole === "MASTER" ? "Usta" : "Mijoz"}
                        </span>
                        {userRole === "MASTER" && (
                            <span className="text-gray-500 font-medium flex items-center gap-1">
                                <Briefcase size={16} className="text-teal-500" />
                                {professions.find(p => p.value === userData?.profession)?.label || userData?.profession}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {isAvailable ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {isAvailable ? "Hozir bo'shman" : "Hozir bandman"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-[2rem] p-2 shadow-lg border border-gray-100 flex gap-2">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "profile" ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <User size={20} />
                    Profil ma'lumotlari
                </button>
                {userRole === "MASTER" && (
                    <>
                        <button
                            onClick={() => setActiveTab("availability")}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "availability" ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <Clock size={20} />
                            Bandlik
                        </button>
                        <button
                            onClick={() => setActiveTab("portfolio")}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "portfolio" ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <Camera size={20} />
                            Portfolio
                        </button>
                    </>
                )}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === "profile" && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-teal-500 p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <User size={24} />
                                <h2 className="text-xl font-bold">Shaxsiy ma'lumotlar</h2>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-bold transition-all border border-white/20"
                            >
                                {isEditing ? "Bekor qilish" : "Tahrirlash"}
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Ism</label>
                                    {isEditing ? (
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all" />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 ml-1">{userData?.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Familiya</label>
                                    {isEditing ? (
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all" />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 ml-1">{userData?.lastName}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefon</label>
                                    {isEditing ? (
                                        <PhoneInput value={formData.phone} onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))} />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 ml-1">{userData?.phone}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Parol</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 ml-1">••••••••</p>
                                    )}
                                </div>

                                {userRole === "MASTER" && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Kasb</label>
                                            {isEditing ? (
                                                <select name="profession" value={formData.profession} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all appearance-none">
                                                    {professions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                                </select>
                                            ) : (
                                                <p className="text-lg font-bold text-gray-900 ml-1">{professions.find(p => p.value === userData?.profession)?.label || userData?.profession}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Manzil</label>
                                            {isEditing ? (
                                                <input type="text" name="add_address" value={formData.add_address} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all" />
                                            ) : (
                                                <p className="text-lg font-bold text-gray-900 ml-1">{userData?.add_address || "Ko'rsatilmadi"}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Viloyat</label>
                                            {isEditing ? (
                                                <select name="region" value={formData.region} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all appearance-none">
                                                    <option value="">Tanlang</option>
                                                    {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                                </select>
                                            ) : (
                                                <p className="text-lg font-bold text-gray-900 ml-1">{regions.find(r => r.value === userData?.region)?.label || "Ko'rsatilmadi"}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tuman</label>
                                            {isEditing ? (
                                                <select name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 transition-all appearance-none" disabled={!formData.region}>
                                                    <option value="">Tanlang</option>
                                                    {districts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                </select>
                                            ) : (
                                                <p className="text-lg font-bold text-gray-900 ml-1">{getDistricts(userData?.region).find(d => d.value === userData?.district)?.label || "Ko'rsatilmadi"}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            {isEditing && (
                                <button onClick={handleSaveProfile} className="w-full mt-10 bg-teal-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all">
                                    O'zgarishlarni saqlash
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "availability" && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-teal-50 text-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Clock size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bandlik rejimi</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Mijozlarga qachon bo'sh ekanligingizni ko'rsatish uchun holatingizni yangilab turing.</p>
                        <div className="flex flex-col items-center gap-4">
                            <div className={`px-6 py-3 rounded-2xl font-bold text-lg flex items-center gap-3 ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {isAvailable ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                {isAvailable ? "Hozir bo'shman" : "Hozir bandman"}
                            </div>
                            <button
                                onClick={() => setIsStatusModalOpen(true)}
                                className="bg-teal-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                            >
                                <Settings size={20} />
                                Holatni o'zgartirish
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "portfolio" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-teal-100 text-teal-600 rounded-xl">
                                        <FileText size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Xizmatlar</h2>
                                </div>
                                <textarea
                                    value={servicesText}
                                    onChange={(e) => setServicesText(e.target.value)}
                                    placeholder="Xizmatlaringiz va narxlaringiz haqida yozing..."
                                    className="w-full h-64 bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-teal-500 transition-all resize-none mb-4"
                                />
                                <button
                                    onClick={handleSaveServices}
                                    disabled={isSavingServices}
                                    className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {isSavingServices ? "Saqlanmoqda..." : "Saqlash"}
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-100 text-teal-600 rounded-xl">
                                            <Camera size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="cursor-pointer bg-teal-50 text-teal-600 px-4 py-2 rounded-xl font-bold hover:bg-teal-100 transition-all flex items-center gap-2 text-sm">
                                            <Camera size={16} />
                                            Rasm
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "image")} />
                                        </label>
                                        <label className="cursor-pointer bg-teal-50 text-teal-600 px-4 py-2 rounded-xl font-bold hover:bg-teal-100 transition-all flex items-center gap-2 text-sm">
                                            <Video size={16} />
                                            Video
                                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, "video")} />
                                        </label>
                                    </div>
                                </div>

                                {portfolioFiles.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {portfolioFiles.map((file) => (
                                            <div key={file.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100">
                                                {file.fileType === "image" ? (
                                                    <Image src={`https://fixoo-backend.onrender.com/image/${file.fileUrl}`} fill alt="Portfolio" className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                        <Video size={32} className="text-gray-400" />
                                                        <video src={`https://fixoo-backend.onrender.com/video/${file.fileUrl}`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" muted loop onMouseOver={(e) => e.currentTarget.play()} onMouseOut={(e) => e.currentTarget.pause()} />
                                                    </div>
                                                )}
                                                <button onClick={() => handleDeleteFile(file.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                                            <Plus size={32} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Hozircha ish namunalari yo'q</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <StatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onStatusChange={(status) => {
                    setIsAvailable(status);
                    fetchProfile();
                }}
            />
        </div>
    );
}
