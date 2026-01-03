'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Star, MapPin, Hammer, Calendar, Phone, CheckCircle2, Info, ArrowLeft, Image as ImageIcon, Video, DollarSign, Award } from 'lucide-react';
import Image from 'next/image';
import BookingModal from '@/app/components/BookingModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        bio: '10 yillik tajribaga ega professional santexnik. Barcha turdagi murakkab ishlarni sifatli bajaramiz. Germaniya texnologiyalari asosida ishlaymiz.',
        availableFrom: '2026-01-05',
        pricing: [
            { service: 'Kran o\'rnatish', price: '50,000 - 150,000 UZS' },
            { service: 'Unitaz o\'rnatish', price: '150,000 - 300,000 UZS' },
            { service: 'Isitish tizimi (montaj)', price: '1,000,000+ UZS' },
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
        ]
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
        availableFrom: '2026-01-03',
        pricing: [
            { service: 'Rozetka o\'rnatish', price: '20,000 - 50,000 UZS' },
            { service: 'Lyustra o\'rnatish', price: '50,000 - 150,000 UZS' },
            { service: 'To\'liq montaj', price: '500,000+ UZS' },
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop',
        ]
    },
    {
        id: 3,
        name: 'Dilshod To\'rayev',
        profession: 'Mebelchi',
        region: 'Farg\'ona viloyati',
        district: 'Marg\'ilon shahri',
        rating: 4.7,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000&auto=format&fit=crop',
        avatar: 'https://i.pravatar.cc/150?u=dilshod',
        bio: 'Zamonaviy oshxona va yotoqxona mebellarini yasash va o\'rnatish.',
        availableFrom: '2026-01-10',
        pricing: [
            { service: 'Oshxona mebeli (metr)', price: '1,500,000+ UZS' },
            { service: 'Shkaf-kupe', price: '2,000,000+ UZS' },
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000&auto=format&fit=crop',
        ]
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
        availableFrom: '2026-01-04',
        pricing: [
            { service: 'Kafel terish (kv.m)', price: '60,000 - 100,000 UZS' },
            { service: 'Bruschatka (kv.m)', price: '40,000 - 80,000 UZS' },
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
        ]
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
        availableFrom: '2026-01-02',
        pricing: [
            { service: 'Emulsiya (kv.m)', price: '10,000 - 20,000 UZS' },
            { service: 'Oboy yopishtirish', price: '15,000 - 30,000 UZS' },
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1000&auto=format&fit=crop',
        ]
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
        availableFrom: '2026-01-06',
        pricing: [
            { service: 'Rom o\'rnatish', price: '100,000+ UZS' },
            { service: 'Setka yasash', price: '50,000 UZS' },
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
        ]
    },
];

export default function MasterProfilePage() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations();
    const [master, setMaster] = useState<any>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const id = Number(params.id);
        const found = mockMasters.find(m => m.id === id) || mockMasters[0]; // Fallback to first for demo
        setMaster(found);
    }, [params.id]);

    if (!master) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Orqaga qaytish
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-teal-50 flex-shrink-0">
                                    <Image
                                        src={master.avatar}
                                        alt={master.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{master.name}</h1>
                                            <p className="text-teal-600 font-black text-lg uppercase tracking-wider">{master.profession}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-2xl">
                                            <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xl font-black text-teal-700">{master.rating}</span>
                                            <span className="text-teal-600/50 font-bold">({master.reviews} sharh)</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-gray-500 font-bold">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-teal-600" />
                                            {master.region}, {master.district}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award size={18} className="text-teal-600" />
                                            Verified Professional
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={() => setIsBookingModalOpen(true)}
                                            className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-teal-600 text-white font-black hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Phone size={20} />
                                            Bog'lanish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Info size={24} className="text-teal-600" />
                                O'zi haqida
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {master.bio}
                            </p>
                        </div>

                        {/* Portfolio Section */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <ImageIcon size={24} className="text-teal-600" />
                                Ish namunalari (Portfolio)
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {master.portfolio.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer">
                                        <Image
                                            src={img}
                                            alt={`Portfolio ${idx}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="space-y-8">
                        {/* Availability Card */}
                        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Calendar size={22} className="text-teal-600" />
                                Bandlik
                            </h3>
                            <div className="p-6 bg-teal-50 rounded-[2rem] border border-teal-100 text-center">
                                <p className="text-teal-700 font-bold mb-1">Eng yaqin bo'sh vaqt:</p>
                                <p className="text-3xl font-black text-teal-900">{master.availableFrom}</p>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <DollarSign size={22} className="text-teal-600" />
                                Xizmat narxlari
                            </h3>
                            <div className="space-y-4">
                                {master.pricing.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                                        <span className="font-bold text-gray-700">{item.service}</span>
                                        <span className="font-black text-teal-600 text-sm">{item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-6 text-center">
                                * Yakuniy narx ish hajmi ko'rilgandan so'ng kelishiladi
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                masterName={master.name}
                masterId={master.id}
            />
            <ToastContainer position="bottom-right" />
        </div>
    );
}
