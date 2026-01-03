'use client';

import { Master } from '@/data/masters';
import { useTranslations } from 'next-intl';
import { Star, MapPin, Clock, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface MasterCardProps {
    master: Master;
    onDetails: (master: Master) => void;
    onContact: (master: Master) => void;
}

export default function MasterCard({ master, onDetails, onContact }: MasterCardProps) {
    const t = useTranslations('landing');

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
                            {/* Placeholder for avatar if no image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl font-bold bg-gray-100">
                                {master.firstName[0]}{master.lastName[0]}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{master.firstName} {master.lastName}</h3>
                            <div className="flex items-center text-teal-600 text-sm font-medium">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {t(`services.${master.profession}`, { defaultMessage: master.profession })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-bold text-gray-900">{master.rating}</span>
                        <span className="text-gray-500 text-xs ml-1">({master.reviewCount})</span>
                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {master.region}, {master.district}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {master.availability.hours} ({master.availability.days.length} kun)
                    </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {master.bio}
                </p>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                <button
                    onClick={() => onDetails(master)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                    {t('details', { defaultMessage: 'Batafsil' })}
                </button>
                <button
                    onClick={() => onContact(master)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors text-sm shadow-sm"
                >
                    {t('contact', { defaultMessage: 'Bog\'lanish' })}
                </button>
            </div>
        </div>
    );
}
