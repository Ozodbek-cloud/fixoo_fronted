'use client';

import { Master } from '@/data/masters';
import { useTranslations } from 'next-intl';
import { X, Star, MapPin, Clock, Briefcase, Phone } from 'lucide-react';
import Image from 'next/image';

interface MasterDetailsModalProps {
    master: Master;
    onClose: () => void;
    onContact: () => void;
}

export default function MasterDetailsModal({ master, onClose, onContact }: MasterDetailsModalProps) {
    const t = useTranslations('landing');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Sidebar Info */}
                    <div className="bg-gray-50 p-8 border-r border-gray-100">
                        <div className="text-center mb-6">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl font-bold bg-gray-100">
                                    {master.firstName[0]}{master.lastName[0]}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{master.firstName} {master.lastName}</h2>
                            <div className="flex items-center justify-center text-teal-600 font-medium mt-1">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {t(`services.${master.profession}`, { defaultMessage: master.profession })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                <span className="text-gray-500 text-sm">Reyting</span>
                                <div className="flex items-center font-bold text-gray-900">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    {master.rating}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                <span className="text-gray-500 text-sm">Tajriba</span>
                                <span className="font-bold text-gray-900">{master.experience} yil</span>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-3">
                                <div className="flex items-start text-sm">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-gray-900">Manzil</span>
                                        <span className="text-gray-500">{master.region}, {master.district}</span>
                                    </div>
                                </div>
                                <div className="flex items-start text-sm">
                                    <Clock className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-gray-900">Ish vaqti</span>
                                        <span className="text-gray-500">{master.availability.hours}</span>
                                        <span className="block text-gray-400 text-xs mt-1">
                                            {master.availability.days.join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onContact}
                                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                            >
                                {t('contact', { defaultMessage: 'Bog\'lanish' })}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {t('about_master', { defaultMessage: 'Usta haqida' })}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {master.bio}
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {t('portfolio', { defaultMessage: 'Portfolio' })}
                        </h3>

                        {master.portfolio.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {master.portfolio.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                        {/* Placeholder for actual image component */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            Image {idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">
                                    {t('no_portfolio', { defaultMessage: 'Portfolio hali yuklanmagan' })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
