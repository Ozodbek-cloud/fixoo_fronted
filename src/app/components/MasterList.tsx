'use client';

import { Master } from '@/data/masters';
import MasterCard from './MasterCard';
import { useTranslations } from 'next-intl';

interface MasterListProps {
    masters: Master[];
    onDetails: (master: Master) => void;
    onContact: (master: Master) => void;
}

export default function MasterList({ masters, onDetails, onContact }: MasterListProps) {
    const t = useTranslations('landing');

    if (masters.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-600">
                    {t('no_results', { defaultMessage: 'Afsuski, hech narsa topilmadi.' })}
                </h3>
                <p className="text-gray-500 mt-2">
                    {t('try_other_filters', { defaultMessage: 'Boshqa qidiruv so\'zlarini sinab ko\'ring.' })}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {masters.map(master => (
                <MasterCard
                    key={master.id}
                    master={master}
                    onDetails={onDetails}
                    onContact={onContact}
                />
            ))}
        </div>
    );
}
