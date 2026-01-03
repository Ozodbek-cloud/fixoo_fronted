'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { regions, getDistricts } from '../lib/location-data';
import { ChevronRight, ChevronLeft, Check, Store, ShieldCheck, MapPin, Eye, EyeOff } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { toast } from 'react-toastify';

type Step = 1 | 2 | 3;

export default function ShopRegistrationForm() {
    const t = useTranslations();
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        shopName: '',
        category: '',
        region: '',
        district: '',
        phone: '',
        password: '',
        confirmPassword: '',
        businessType: '',
        inn: '',
        stir: '',
        otp: '',
        logo: ''
    });

    const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'region') {
            const newDistricts = getDistricts(value);
            setDistricts(newDistricts);
            setFormData(prev => ({ ...prev, district: '' }));
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.shopName || !formData.category || !formData.region || !formData.district || !formData.phone || !formData.password || !formData.confirmPassword || !formData.logo) {
                toast.error(t('fill_all_fields', { defaultMessage: "Iltimos, barcha maydonlarni to'ldiring, jumladan do'kon logosini ham" }));
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error(t('passwords_not_match', { defaultMessage: "Parollar mos kelmadi" }));
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.businessType) {
                toast.error("Iltimos, biznes turini tanlang");
                return;
            }
            if ((formData.businessType === 'MCHJ' || formData.businessType === 'YTT') && !formData.inn) {
                toast.error("Iltimos, INN/STIR raqamini kiriting");
                return;
            }
            setStep(3);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock saving to localStorage
        setTimeout(() => {
            const shopData = {
                ...formData,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                status: 'PENDING',
                role: 'SELLER'
            };

            // Save to shops list
            const existingShops = JSON.parse(localStorage.getItem('shops') || '[]');
            localStorage.setItem('shops', JSON.stringify([...existingShops, shopData]));

            // Simulate Login
            localStorage.setItem('userRole', 'SELLER');
            localStorage.setItem('currentUser', JSON.stringify(shopData));

            setLoading(false);
            toast.success("Do'kon muvaffaqiyatli ro'yxatdan o'tkazildi! Tez orada adminlarimiz siz bilan bog'lanishadi.");
            router.push('/');
            // Force refresh to update Navbar
            window.location.reload();
        }, 1500);
    };

    const isStep1Valid = () => {
        return (
            formData.shopName.trim() !== '' &&
            formData.category !== '' &&
            formData.region !== '' &&
            formData.district !== '' &&
            formData.phone.trim() !== '' &&
            formData.password.trim() !== '' &&
            formData.confirmPassword.trim() !== '' &&
            formData.logo.trim() !== '' &&
            formData.password === formData.confirmPassword
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Minimalist Progress Bar */}
            <div className="flex items-center justify-between mb-10 px-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= s ? 'border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'border-gray-200 bg-white text-gray-400'
                            }`}>
                            {step > s ? <Check size={20} /> : <span className="font-bold">{s}</span>}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${step > s ? 'bg-teal-600' : 'bg-gray-100'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-5 animate-fade-in-up">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="relative group sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    Do'kon nomi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none shadow-md focus:shadow-lg"
                                        placeholder="Do'koningiz nomi"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative group sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    Do'kon logotipi (URL) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="logo"
                                        value={formData.logo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none shadow-md focus:shadow-lg"
                                        placeholder="https://images.unsplash.com/..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative group sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    Mahsulot toifasi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer shadow-md focus:shadow-lg"
                                    required
                                >
                                    <option value="" disabled>{t('select_category', { defaultMessage: 'Kategoriyani tanlang' })}</option>
                                    <option value="construction">{t('shop_categories.construction')}</option>
                                    <option value="plumbing">{t('shop_categories.plumbing')}</option>
                                    <option value="electrical">{t('shop_categories.electrical')}</option>
                                    <option value="furniture">{t('shop_categories.furniture')}</option>
                                    <option value="window">{t('shop_categories.window')}</option>
                                    <option value="decor">{t('shop_categories.decor')}</option>
                                    <option value="universal">{t('shop_categories.universal')}</option>
                                </select>
                            </div>

                            <div className="relative group">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    {t('region')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer shadow-md focus:shadow-lg"
                                    required
                                >
                                    <option value="">{t('select_region')}</option>
                                    {regions.map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative group">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    {t('district')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    disabled={!formData.region}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer disabled:opacity-50 shadow-md focus:shadow-lg"
                                    required
                                >
                                    <option value="">{t('select_district')}</option>
                                    {districts.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <PhoneInput
                                    value={formData.phone}
                                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    {t('password')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none shadow-md focus:shadow-lg"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    {t('confirm_password')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none shadow-md focus:shadow-lg"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-8"
                        >
                            Keyingi qadam
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Yuridik ma'lumotlar</h3>
                                    <p className="text-sm text-gray-500 font-medium">Do'koningizni tasdiqlash uchun kerak</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Biznes turi</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {['MCHJ', 'YTT', "O'zini o'zi band qilish"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, businessType: type })}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${formData.businessType === type ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-md' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-teal-200'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {(formData.businessType === 'MCHJ' || formData.businessType === 'YTT') && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">INN / STIR raqami</label>
                                        <input
                                            type="text"
                                            name="inn"
                                            value={formData.inn}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-md"
                                            placeholder="9 xonali raqam"
                                            maxLength={9}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={24} />
                                Orqaga
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-[2] bg-teal-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Davom etish
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
                            <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Tasdiqlash</h3>
                            <p className="text-gray-500 font-medium mb-8">Telefon raqamingizga yuborilgan 4 xonali kodni kiriting</p>

                            <div className="flex justify-center gap-3 mb-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        className="w-14 h-16 text-center text-2xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:bg-white outline-none transition-all shadow-md"
                                        onChange={(e) => {
                                            if (e.target.value && i < 4) {
                                                (e.target.nextSibling as HTMLInputElement)?.focus();
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-gray-400 font-medium">
                                Kod kelmadimi? <button type="button" className="text-teal-600 font-bold hover:underline">Qayta yuborish</button>
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={24} />
                                Orqaga
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-teal-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check size={24} />
                                        Ro'yxatdan o'tishni yakunlash
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
