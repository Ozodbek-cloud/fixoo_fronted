'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { ShoppingCart, Heart, Star, MapPin, Store, Search, X, CheckCircle2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';



export default function Marketplace() {
    const t = useTranslations();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handlePurchase = (product: any) => {
        toast.success("Sotib olish rasmiylashtirildi!", {
            icon: <CheckCircle2 className="text-white" />
        });
        // Mock notification to seller
        console.log(`Notification sent to ${product.shop}: New order for ${product.name}`);
        setSelectedProduct(null);
    };

    // const filteredProducts = mockProducts.filter(p =>
    //     p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     p.shop.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
            <Navbar />

            <main className="max-w-7xl mx-auto py-10 px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{t('marketplace', { defaultMessage: 'Bozor' })}</h1>
                        <p className="text-gray-600">Barcha turdagi qurilish mollari va asboblar bir joyda</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Mahsulot qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

            </main>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-scale-in">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
                            {/* Left Side: Image Gallery */}
                            <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
                                <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg">
                                    <Image
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Right Side: Info */}
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                        Yangi
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold text-gray-900">{selectedProduct.rating}</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                                    {selectedProduct.name}
                                </h2>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Store size={18} className="text-teal-600" />
                                        <span className="font-bold">{selectedProduct.shop}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <MapPin size={18} className="text-gray-400" />
                                        <span>{selectedProduct.region}</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tavsif</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {selectedProduct.description}
                                    </p>
                                </div>

                                {selectedProduct.sizes && (
                                    <div className="mb-8">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">O'lchamlar</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.sizes.map((size: string) => (
                                                <button key={size} className="px-4 py-2 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all">
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-8 border-t border-gray-100">
                                    <div className="flex items-end justify-between mb-6">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 mb-1">Narxi:</p>
                                            <h3 className="text-3xl font-black text-teal-600">
                                                {selectedProduct.price} <span className="text-lg font-bold">so'm</span>
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 line-through">1,500,000 so'm</p>
                                            <p className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg mt-1">-20% chegirma</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => toast.success("Savatga qo'shildi")}
                                            className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                                        >
                                            <ShoppingBag size={20} />
                                            Savatga qo'shish
                                        </button>
                                        <button
                                            onClick={() => handlePurchase(selectedProduct)}
                                            className="flex items-center justify-center gap-2 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 transform hover:-translate-y-0.5"
                                        >
                                            <ShoppingCart size={20} />
                                            Sotib olish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
            <ToastContainer position="bottom-right" />
        </div>
    );
}
