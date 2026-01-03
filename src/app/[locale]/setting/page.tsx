"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HammerLoader from "../../components/HammerLoader";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import axios from "axios";
import {
  LogOut,
  ShieldAlert,
  MessageCircle,
  Phone,
  Send,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("https://fixoo-backend.onrender.com/api/v1/my/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      localStorage.clear();
      toast.success("Akkount muvaffaqiyatli o'chirildi!");
      router.push("/");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const faqs = [
    {
      question: "Qanday qilib buyurtma beraman?",
      answer: "Usta qidirish bo'limiga o'ting, kerakli ustani tanlang va unga bog'laning."
    },
    {
      question: "To'lov qanday amalga oshiriladi?",
      answer: "To'lov usta bilan bevosita amalga oshiriladi. Platform orqali to'lov qilish talab etilmaydi."
    },
    {
      question: "Agar xizmat sifatsiz bo'lsa nima qilaman?",
      answer: "Muammoni hal qilish uchun qo'llab-quvvatlash xizmatiga murojaat qiling."
    }
  ];

  if (isLoading) return <HammerLoader fullScreen={true} showText={true} text="Yuklanmoqda..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Sozlamalar</h1>
          <p className="text-gray-500 font-medium text-lg">Yordam markazi va akkaunt boshqaruvi</p>
        </div>

        <div className="space-y-8">
          {/* Support Section */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-teal-500 p-8 flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-2xl">
                <MessageCircle size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Qo'llab-quvvatlash</h2>
                <p className="text-teal-50 opacity-80">Biz bilan bog'laning yoki savollaringizga javob toping</p>
              </div>
            </div>

            <div className="p-8">
              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <a href="tel:+998948035747" className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-sm text-gray-500">+998 94 803 57 47</p>
                </a>
                <a href="https://t.me/fixoomessagebot" target="_blank" rel="noopener noreferrer" className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Send size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Telegram Bot</h3>
                  <p className="text-sm text-gray-500">@fixoomessagebot</p>
                </a>
                <a href="mailto:support@fixoo.uz" className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all group">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-500">support@fixoo.uz</p>
                </a>
              </div>

              {/* FAQ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle size={20} className="text-teal-500" />
                  <h3 className="text-xl font-bold text-gray-900">Tez-tez beriladigan savollar</h3>
                </div>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-all"
                    >
                      <span className="font-bold text-gray-700 text-left">{faq.question}</span>
                      {expandedFAQ === idx ? <ChevronUp size={20} className="text-teal-500" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>
                    {expandedFAQ === idx && (
                      <div className="p-5 bg-white text-gray-600 border-t border-gray-50 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-red-100 overflow-hidden">
            <div className="bg-red-500 p-8 flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-2xl">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Xavfli zona</h2>
                <p className="text-red-50 opacity-80">Akkauntni o'chirish va boshqaruv</p>
              </div>
            </div>

            <div className="p-8">
              <div className="bg-red-50 rounded-3xl p-6 mb-8 border border-red-100">
                <p className="text-red-800 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Diqqat: Akkauntni o'chirish qaytarib bo'lmaydi!
                </p>
                <p className="text-red-600/80 text-sm leading-relaxed">
                  Barcha ma'lumotlaringiz, buyurtmalar tarixi va portfolio fayllari butunlay o'chirib tashlanadi.
                </p>
              </div>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                Akkauntni butunlay o'chirish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LogOut size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Akkauntni o'chirasizmi?</h3>
            <p className="text-gray-500 text-center mb-8 leading-relaxed">
              Ushbu amalni qaytarib bo'lmaydi. Barcha ma'lumotlaringiz o'chib ketadi.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Yo'q, qolsin
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}

// Helper icons
function AlertCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
