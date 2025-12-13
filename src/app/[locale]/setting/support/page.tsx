'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SupportPage() {
  const router = useRouter();
  const t = useTranslations();

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Sozlamalar</h1>
          <p className="text-sm sm:text-base text-gray-600">Yordam va maslahat olish</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 sm:space-x-4 bg-white rounded-lg sm:rounded-xl p-1 shadow-md">
            <button
              onClick={() => router.push('/setting')}
              className="flex-1 text-gray-600 hover:text-teal-600 hover:bg-gray-50 text-center py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profil & Xavfli zona
            </button>
            <div className="flex-1 bg-blue-500 text-white text-center py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Qo'llab-quvvatlash
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Yordam markazi</h2>
                <p className="text-xs sm:text-sm text-blue-100">Savollar va yordam</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6">
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Bizga murojaat qiling yoki tez-tez beriladigan savollar bilan tanishib chiqing
            </p>

            {/* Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Phone Contact */}
              <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Telefon orqali</h3>
                </div>
                <p className="text-gray-600 text-sm"> +998 94 803 57 47</p>
                <p className="text-gray-500 text-xs mt-1">9:00 - 18:00 (Dush-Juma)</p>
              </div>

              {/* Email Contact */}
              <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Email orqali</h3>
                </div>
                <p className="text-gray-600 text-sm">support@fixoo.uz</p>
                <p className="text-gray-500 text-xs mt-1">24 soat ichida javob</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m0 0l-3-3m3 3l3-3"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Admin orqali</h3>
                </div>
                <p className="text-gray-500 text-xs mt-1">24 soat ichida javob</p>
                <a href="https://t.me/fixoomessagebot" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 w-45 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m0 0l-3-3m3 3l3-3" />
                  </svg>
                  Adminga yozish
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          {/* FAQ Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Tez-tez beriladigan savollar</h2>
                <p className="text-xs sm:text-sm text-purple-100">Ko'p beriladigan savollarga javoblar</p>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedFAQ === index ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 py-3 bg-white border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 