'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import axios from 'axios';
interface addsInter {
  text: string,
  photoUrl: string,
  serverLink: string
}
export default function LandingPage() {
  const router = useRouter();
  const t = useTranslations('landing');
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [adds, setAdds] = useState<addsInter[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const rol = localStorage.getItem("userRole");

    if (token && rol === "MASTER") {
      router.push("/homespecialist");
    } else if (token && rol === 'USER') {
      router.push("/homeclient");
    }
    else {
      router.push("/");
    }
  }, [router]);

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

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const elements = [heroRef.current, featuresRef.current, whyChooseRef.current, cardsRef.current];
    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleSpecialistRegister = () => {
    router.push('/register?role=MASTER');
  };

  const handleClientRegister = () => {
    router.push('/register?role=USER');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="fixed inset-y-0 w-full pointer-events-none z-50 hidden lg:block">

        <div className="pointer-events-auto fixed top-1/2 -translate-y-1/2 left-4">
          <div onClick={() => router.push(adds[0]?.serverLink)} className="w-[260px] h-[550px] bg-white rounded-2xl shadow-xl overflow-hidden                transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"         >
            <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
              Reklama
            </div>

            {adds[0]?.photoUrl && (<Image src={adds[0].photoUrl} width={260} height={300} alt="reklama" className="object-cover w-full h-[300px]" />)}

            <div className="p-4">
              <h1 className="text-base font-semibold text-center text-gray-800 line-clamp-2">
                {adds[0]?.text}
              </h1>

              <button className="mt-4 w-full bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition">
                Batafsil →
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto fixed top-1/2 -translate-y-1/2 right-4">
          <div onClick={() => router.push(adds[1]?.serverLink)} className="w-[260px] h-[550px] bg-white rounded-2xl shadow-xl overflow-hidden                transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"         >
            <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
              Reklama
            </div>

            {adds[1]?.photoUrl && (
              <Image src={adds[1].photoUrl} width={260} height={300} alt="reklama" className="object-cover w-full h-[300px]" />
            )}

            <div className="p-4">
              <h1 className="text-base font-semibold text-center text-gray-800 line-clamp-2">
                {adds[1]?.text}
              </h1>

              <button className="mt-4 w-full bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition">
                Batafsil →
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Hero Section */}
      <div className="extra_container mx-auto px-4 py-16">
        <div ref={heroRef} className="grid md:grid-cols-2    gap-5 items-center mb-20 opacity-0 transform translate-y-10">
          {/* Left side - Text */}
          <div className="text-center pl-10  md:text-left">
            <div className="relative mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 mb-8 leading-tight">
                {t('hero_title')}
              </h1>
              <div className="absolute inset-0 text-4xl md:text-6xl lg:text-8xl font-extrabold text-teal-900/10 blur-sm transform scale-110">
                {t('hero_title')}
              </div>
            </div>
            <p className="text-lg md:text-2xl lg:text-3xl text-gray-600 mb-10 leading-relaxed font-light">
              {t('hero_subtitle')}
            </p>
            <div className="flex justify-center md:justify-start">
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full"></div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center  md:justify-end">
            <div className="w-full max-w-lg">
              <Image
                src="/images/fixoo-landing.png"
                alt="Fixoo Platform"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-24 opacity-0 transform translate-y-10">
          <div className="group relative bg-gradient-to-br from-white to-teal-50/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-teal-100/50 hover:border-teal-200">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-teal-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-teal-800 mb-6">{t('for_specialists')}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t('for_specialists_desc')}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100/50 hover:border-blue-200">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-teal-800 mb-6">{t('for_clients')}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t('for_clients_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div ref={whyChooseRef} className="text-center max-w-7xl mx-auto mb-16 opacity-0 transform translate-y-10">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-12">
            {t('why_choose_title')}
          </h2>
          <div className="grid  md:grid-cols-3 gap-8">
            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-teal-100/50">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-4">{t('fast_easy')}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{t('fast_easy_desc')}</p>
            </div>
            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-teal-100/50">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-4">{t('reliable')}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{t('reliable_desc')}</p>
            </div>
            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-teal-100/50">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-4">{t('wide_choice')}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{t('wide_choice_desc')}</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-teal-800 mb-12">
            {t('video_section_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Video 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-teal-100">
              <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">{t('video_loading')}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-2">{t('video1_title')}</h3>
                <p className="text-gray-600">{t('video1_desc')}</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-teal-100">
              <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">{t('video_loading')}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-2">{t('video2_title')}</h3>
                <p className="text-gray-600">{t('video2_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Cards */}
        <div ref={cardsRef} className="max-w-4xl mx-auto opacity-0 transform translate-y-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-teal-800 mb-12">
            {t('join_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Specialist Card */}
            <div className="group relative bg-gradient-to-br from-white via-teal-50/30 to-teal-100/30 rounded-3xl p-10 shadow-2xl border border-teal-200/50 hover:border-teal-300 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-teal-700/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-teal-800 mb-6">{t('specialist_card_title')}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {t('specialist_card_desc')}
                </p>
                <button
                  onClick={handleSpecialistRegister}
                  className="w-full bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-teal-700 hover:via-teal-800 hover:to-teal-900 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  {t('specialist_register_btn')}
                </button>
              </div>
            </div>

            {/* Client Card */}
            <div className="group relative bg-gradient-to-br from-white via-blue-50/30 to-blue-100/30 rounded-3xl p-10 shadow-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-700/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-teal-800 mb-6">{t('client_card_title')}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {t('client_card_desc')}
                </p>
                <button
                  onClick={handleClientRegister}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  {t('client_register_btn')}
                </button>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">{t('already_have_account')}</p>
            <button
              onClick={handleLogin}
              className="text-teal-700 font-semibold hover:text-teal-800 underline transition-colors duration-300"
            >
              {t('login_btn')}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">{t('hero_title')}</p>
          <p className="text-teal-200">{t('footer_desc')}</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 