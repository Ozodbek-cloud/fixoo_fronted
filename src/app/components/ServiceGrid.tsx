'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Wrench, Zap, Droplets, Hammer, Paintbrush, Truck, Shield, Clock } from 'lucide-react';

const services = [
    { id: 'plumbing', icon: Droplets, color: 'bg-blue-100 text-blue-600', span: 'col-span-1 md:col-span-2' },
    { id: 'electrical', icon: Zap, color: 'bg-yellow-100 text-yellow-600', span: 'col-span-1' },
    { id: 'cleaning', icon: Paintbrush, color: 'bg-purple-100 text-purple-600', span: 'col-span-1' },
    { id: 'repair', icon: Wrench, color: 'bg-orange-100 text-orange-600', span: 'col-span-1 md:col-span-2' },
    { id: 'moving', icon: Truck, color: 'bg-green-100 text-green-600', span: 'col-span-1' },
    { id: 'security', icon: Shield, color: 'bg-red-100 text-red-600', span: 'col-span-1' },
];

export default function ServiceGrid() {
    const t = useTranslations('landing');

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('services_title', { defaultMessage: 'Ommabop Xizmatlar' })}
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {t('services_subtitle', { defaultMessage: 'Eng malakali ustalar sizning xizmatingizda' })}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px]">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-100 ${service.color} ${service.span}`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <service.icon size={120} />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <service.icon size={24} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-1">
                                        {t(`services.${service.id}`, { defaultMessage: service.id.charAt(0).toUpperCase() + service.id.slice(1) })}
                                    </h3>
                                    <p className="text-sm opacity-80 font-medium flex items-center gap-1">
                                        100+ {t('specialists', { defaultMessage: 'Ustalar' })}
                                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Call to Action Card */}
                    <div className="col-span-2 md:col-span-2 rounded-3xl p-8 bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 text-left">
                            <h3 className="text-2xl font-bold mb-2">{t('all_services', { defaultMessage: 'Barcha xizmatlar' })}</h3>
                            <p className="text-gray-300">{t('all_services_desc', { defaultMessage: '50 dan ortiq xizmat turlari mavjud' })}</p>
                        </div>
                        <button className="relative z-10 w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Clock size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
