'use client';

import { useTranslations } from 'next-intl';
import ShopRegistrationForm from '../../components/ShopRegistrationForm';

export default function ShopRegistrationPage() {
    const t = useTranslations('auth');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {t('shop_registration_title', { defaultMessage: "Do'kon sifatida ro'yxatdan o'tish" })}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {t('shop_registration_subtitle', { defaultMessage: "Biznesingizni kengaytiring va yangi mijozlarni toping" })}
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <ShopRegistrationForm />
                </div>
            </div>
        </div>
    );
}
