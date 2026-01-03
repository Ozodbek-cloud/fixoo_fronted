'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import LangSwitch from './LangSwitch';

export default function LandingHeader() {
  const t = useTranslations();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegister = () => {
    router.push("/register?role=MASTER");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/fixoo.png"
              alt="Fixoo Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
            scrolled ? 'text-teal-800' : 'text-teal-900'
          }`}>
            Fixoo
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:block">
            <LangSwitch />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={handleLogin}
              className={`hidden md:block px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                scrolled 
                  ? 'text-gray-600 hover:text-teal-600' 
                  : 'text-gray-700 hover:text-teal-700 bg-white/20 backdrop-blur-sm hover:bg-white/40'
              }`}
            >
              {t('landing.login_btn')}
            </button>
            
            <button
              onClick={handleRegister}
              className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-white shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-teal-500/50 hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-400 hover:to-teal-600"
            >
              {t('register')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
