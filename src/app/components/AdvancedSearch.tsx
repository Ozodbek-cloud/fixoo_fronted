'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Hammer, ShoppingBag, Star, User, Phone, Info, Calendar, LayoutGrid, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { professions } from '../lib/profession-data';
import { regions, getDistricts } from '../lib/location-data';
import Link from 'next/link';
import BookingModal from './BookingModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AdvancedSearchProps = {
    onSearch: (filters: SearchFilters) => void
};


const mockMasters = [
    {
        id: 1,
        name: 'Azizbek Karimov',
        profession: 'Santexnik',
        region: 'Toshkent shahri',
        district: 'Chilonzor tumani',
        rating: 4.9,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1000&auto=format&fit=crop',
        avatar: 'https://i.pravatar.cc/150?u=azizbek',
        bio: '10 yillik tajribaga ega professional santexnik. Barcha turdagi murakkab ishlarni sifatli bajaramiz.',
        availableFrom: '2026-01-05'
    },
    {
        id: 2,
        name: 'Rustam Ahmedov',
        profession: 'Elektrik',
        region: 'Samarqand viloyati',
        district: 'Pastdarg\'om tumani',
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
        avatar: 'https://i.pravatar.cc/150?u=rustam',
        bio: 'Yuqori kuchlanishli tarmoqlar va uy elektr jihozlarini ta\'mirlash bo\'yicha mutaxassis.',
        availableFrom: '2026-01-03'
    },
    {
        id: 3,
        name: 'Dilshod To\'rayev',
        profession: 'Mebelchi',
        region: 'Farg\'ona viloyati',
        district: 'Marg\'ilon shahri',
        rating: 4.7,
        reviews: 56,
        image: '',
        avatar: '',
        bio: 'Zamonaviy oshxona va yotoqxona mebellarini yasash va o\'rnatish.',
        availableFrom: '2026-01-10'
    },
    {
        id: 4,
        name: 'Jamshid Ergashev',
        profession: 'Plitkachi',
        region: 'Toshkent shahri',
        district: 'Yunusobod tumani',
        rating: 5.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1000&auto=format&fit=crop',
        avatar: 'https://i.pravatar.cc/150?u=jamshid',
        bio: 'Kafel va bruschatka terish bo\'yicha 15 yillik tajriba. Sifat kafolatlangan.',
        availableFrom: '2026-01-04'
    },
    {
        id: 5,
        name: 'Otabek Yusupov',
        profession: 'Bo‘yoqchi',
        region: 'Buxoro viloyati',
        district: 'Buxoro shahri',
        rating: 4.6,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1000&auto=format&fit=crop',
        avatar: 'https://i.pravatar.cc/150?u=otabek',
        bio: 'Devorlarni bo\'yash va dekorativ pardozlash ishlari. Tez va sifatli.',
        availableFrom: '2026-01-02'
    },
    {
        id: 6,
        name: 'Sardor Rahimov',
        profession: 'Akfa romchi',
        region: 'Namangan viloyati',
        district: 'Namangan shahri',
        rating: 4.9,
        reviews: 132,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
        avatar: 'https://i.pravatar.cc/150?u=sardor',
        bio: 'Akfa rom va eshiklarni o\'rnatish hamda ta\'mirlash. 8 yillik tajriba.',
        availableFrom: '2026-01-06'
    },
];

const mockProducts = [
    { id: 1, name: 'Makita DHP482Z', category: 'tools', price: '1,200,000', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop', shop: 'Asboblar Olami', shopLogo: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=100&auto=format&fit=crop', region: 'Toshkent shahri', district: 'Chilonzor tumani' },
    { id: 2, name: 'Bosch GWS 9-115', category: 'tools', price: '850,000', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop', shop: 'Stroy Market', shopLogo: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=100&auto=format&fit=crop', region: 'Samarqand viloyati', district: 'Pastdarg\'om tumani' },
    { id: 3, name: 'Karcher WD 3', category: 'cleaning', price: '1,500,000', rating: 4.7, reviews: 210, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop', shop: 'Premium Tools', shopLogo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=100&auto=format&fit=crop', region: 'Namangan viloyati', district: 'Chortoq tumani' },
];

export interface SearchFilters {
    name: string;
    profession: string;
    category: string;
    region: string;
    district: string;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
    const t = useTranslations();
    const [searchType, setSearchType] = useState<'MASTER' | 'PRODUCT'>('MASTER');
    const [filters, setFilters] = useState({
        name: '',
        profession: '',
        category: '',
        region: '',
        district: ''
    });
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState<{ id: number, name: string } | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Reactive search: update results when filters change
    useEffect(() => {
        const hasActiveFilter = filters.name || filters.profession || filters.category || filters.region || filters.district;

        if (!hasActiveFilter) {
            setResults([]);
            setHasSearched(false);
            return;
        }
        onSearch(filters);
        
        setIsSearching(true);
        setHasSearched(true);

        const timer = setTimeout(() => {
            if (searchType === 'MASTER') {
                const filtered = mockMasters.filter(m =>
                    (filters.name === '' || m.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                    (filters.profession === '' || m.profession === filters.profession || professions.find(p => p.value === filters.profession)?.label === m.profession) &&
                    (filters.region === '' || m.region === filters.region) &&
                    (filters.district === '' || m.district === filters.district)
                ).sort((a, b) => {
                    const dateA = new Date(a.availableFrom).getTime();
                    const dateB = new Date(b.availableFrom).getTime();
                    if (dateA !== dateB) return dateA - dateB;
                    return b.rating - a.rating;
                });
                setResults(filtered);
            } else {
                const filtered = mockProducts.filter(p =>
                    (filters.name === '' || p.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                    (filters.category === '' || p.category === filters.category) &&
                    (filters.region === '' || p.region === filters.region) &&
                    (filters.district === '' || p.district === filters.district)
                );
                setResults(filtered);
            }
            setIsSearching(false);
        }, 300); // Faster response for reactive search

        return () => clearTimeout(timer);
    }, [filters, searchType]);

    const isValid = searchType === 'MASTER'
        ? (!!filters.name || !!filters.profession || !!filters.region || !!filters.district)
        : !!filters.name;

    // Re-evaluating master validation based on "kasbini kiritish majburiy"
    const isMasterValid = !!filters.profession || filters.name.length > 0; // Allowing name search too as it's common

    const availableDistricts = filters.region ? getDistricts(filters.region) : [];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            {/* Search Toggle */}
            <div className="flex justify-center mb-10">
                <div className="bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 flex gap-1">
                    <button
                        onClick={() => setSearchType('MASTER')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${searchType === 'MASTER' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Hammer size={20} />
                        {t('search_masters', { defaultMessage: 'Usta qidirish' })}
                    </button>
                    <button
                        onClick={() => setSearchType('PRODUCT')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${searchType === 'PRODUCT' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <ShoppingBag size={20} />
                        {t('search_products', { defaultMessage: 'Mahsulot qidirish' })}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Name Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={searchType === 'MASTER' ? "Usta ismi (ixtiyoriy)" : "Mahsulot nomi *"}
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                        />
                    </div>

                    {/* Profession / Category Select */}
                    {searchType === 'MASTER' ? (
                        <div className="relative">
                            <Hammer className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filters.profession}
                                onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium appearance-none ${!filters.profession ? 'text-gray-400' : 'text-gray-900'}`}
                            >
                                <option value="">Kasb tanlang</option>
                                {professions.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="relative">
                            <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium appearance-none ${!filters.category ? 'text-gray-400' : 'text-gray-900'}`}
                            >
                                <option value="">Kategoriya (ixtiyoriy)</option>
                                <option value="tools">Asboblar</option>
                                <option value="cleaning">Tozalash</option>
                                <option value="materials">Qurilish mollari</option>
                            </select>
                        </div>
                    )}

                    {/* Region Select */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={filters.region}
                            onChange={(e) => setFilters({ ...filters, region: e.target.value, district: '' })}
                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium appearance-none ${!filters.region ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                            <option value="">Viloyat (ixtiyoriy)</option>
                            {regions.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* District Select */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={filters.district}
                            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                            disabled={!filters.region}
                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium appearance-none ${!filters.district ? 'text-gray-400' : 'text-gray-900'} ${!filters.region ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Tuman (ixtiyoriy)</option>
                            {availableDistricts.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <button
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${isValid ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-xl shadow-teal-600/20 transform hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        {isSearching ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Search size={24} />
                                Qidirish
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchType === 'MASTER' ? (
                    results.map((master) => (
                        <div key={master.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-teal-50 bg-gray-100">
                                    <Image
                                        src={master.avatar || 'https://i.pravatar.cc/150?u=placeholder'}
                                        alt={master.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-black text-gray-900 text-xl group-hover:text-teal-600 transition-colors">{master.name}</h3>
                                        <div className="bg-teal-50 px-2 py-1 rounded-lg flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold text-teal-700">{master.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-teal-600 font-bold text-sm uppercase tracking-wider">{master.profession}</p>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                        <MapPin size={12} />
                                        <span>{master.region}, {master.district}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex-1">
                                <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-sm">
                                    <Info size={16} className="text-teal-600" />
                                    BIO
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                    {master.bio}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50">
                                    <div className="flex items-center gap-2 text-teal-700">
                                        <Calendar size={18} />
                                        <span className="text-sm font-bold">Bo'shash muddati:</span>
                                    </div>
                                    <span className="text-sm font-black text-teal-900">{master.availableFrom}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/masters/${master.id}`}
                                        className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={20} />
                                        Batafsil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedMaster({ id: master.id, name: master.name });
                                            setIsBookingModalOpen(true);
                                        }}
                                        className="flex-1 py-4 rounded-2xl bg-teal-600 text-white font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                                    >
                                        <Phone size={20} />
                                        Bog'lanish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    results.map((product) => (
                        <div key={product.id} className="bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100">
                            <div className="relative aspect-square mb-5 rounded-3xl overflow-hidden bg-gray-50">
                                <Image
                                    src={product.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1000&auto=format&fit=crop'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="px-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-full">
                                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-teal-200">
                                            <Image
                                                src={product.shopLogo || 'https://i.pravatar.cc/50?u=shop'}
                                                alt={product.shop}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider">{product.shop}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                                    </div>
                                </div>
                                <h3 className="font-black text-gray-900 text-xl mb-2 group-hover:text-teal-600 transition-colors">{product.name}</h3>
                                <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                                    <MapPin size={12} />
                                    <span>{product.region}, {product.district}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-2xl font-black text-teal-600">{product.price} <span className="text-sm font-bold">UZS</span></div>
                                    <button className="p-4 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                                        <ShoppingBag size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {results.length === 0 && !isSearching && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hech narsa topilmadi</h3>
                    <p className="text-gray-500">Boshqa qidiruv so'zlarini sinab ko'ring</p>
                </div>
            )}
            {/* Booking Modal */}
            {selectedMaster && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    masterName={selectedMaster.name}
                    masterId={selectedMaster.id}
                />
            )}
            <ToastContainer position="bottom-right" />
        </div>
    );
}
