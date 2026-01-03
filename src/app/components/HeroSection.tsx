'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HeroSection() {
    const t = useTranslations('landing');

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-50">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-100/30 to-transparent rounded-l-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-green-100/40 to-transparent rounded-r-full blur-3xl opacity-60 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-center lg:text-left space-y-8">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight animate-fade-in-up delay-100">
                        {t('hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-500">
                            {t('hero_title_2')}
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
                        {t('hero_subtitle')}
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm text-gray-500 animate-fade-in-up delay-400">
                        <span>{t('popular')}</span>
                        {['Santexnik', 'Elektrik', 'Tozalash', 'Ta\'mirlash'].map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-white border border-gray-200 cursor-pointer hover:border-teal-500 hover:text-teal-600 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative animate-fade-in-up delay-500 hidden lg:block">
                    <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                        <Image
                            src="/images/fixoo-landing.png"
                            alt="Professional Craftsman"
                            width={700}
                            height={700}
                            className="w-full h-auto object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Floating Cards */}
                    <div className="absolute top-20 -left-10 bg-white p-4 rounded-2xl shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm z-20 animate-bounce-slow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{t('verified_pro')}</p>
                                <p className="font-bold text-gray-800">{t('reliable_100')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-20 -right-5 bg-white p-4 rounded-2xl shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm z-20 animate-bounce-slow delay-700">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                                ))}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">5000+ </p>
                                <p className="text-xs text-gray-500">{t('happy_clients')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
