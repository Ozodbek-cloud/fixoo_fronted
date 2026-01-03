'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { ShoppingCart, Heart, Star, MapPin, Store, Search, X, CheckCircle2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

const mockProducts = [
    { id: 1, name: 'Makita DHP482Z', price: '1,200,000', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop', shop: 'Asboblar Olami', region: 'Toshkent', description: 'Professional zarbali drel-shurupovert. 18V LXT Li-ion batareyasi bilan ishlaydi.', sizes: ['Standart'] },
    { id: 2, name: 'Bosch GWS 9-115', price: '850,000', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop', shop: 'Stroy Market', region: 'Samarqand', description: 'Ixcham va kuchli burchakli silliqlash mashinasi (bolgarka).', sizes: ['115mm', '125mm'] },
    { id: 3, name: 'Karcher WD 3', price: '1,500,000', rating: 4.7, reviews: 210, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop', shop: 'Premium Tools', region: 'Namangan', description: 'Ko\'p funksiyali xo\'jalik changyutgichi. Nam va quruq tozalash uchun.', sizes: ['17L', '20L'] },
    { id: 4, name: 'Stanley FatMax', price: '450,000', rating: 4.6, reviews: 56, image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1000&auto=format&fit=crop', shop: 'Usta Do\'kon', region: 'Buxoro', description: 'Yuqori sifatli o\'lchov lentasi (ruletka). 8 metr uzunlikda.', sizes: ['5m', '8m', '10m'] },
    { id: 5, name: 'DeWalt DCD771C2', price: '1,800,000', rating: 4.9, reviews: 342, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop', shop: 'Pro Tools', region: 'Toshkent', description: 'Kuchli va ixcham drel-shurupovert. Ikki tezlikli uzatmalar qutisi.', sizes: ['Standart'] },
    { id: 6, name: 'Hilti TE 30', price: '4,500,000', rating: 5.0, reviews: 15, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop', shop: 'Hilti Center', region: 'Toshkent', description: 'Professional perforator. Yuqori unumdorlik va chidamlilik.', sizes: ['SDS-Plus'] },
];

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

    const filteredProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shop.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
                            {/* Image Container */}
                            <div
                                className="relative aspect-square mb-4 bg-gray-50 rounded-2xl overflow-hidden cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-md text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                                    <Heart size={20} />
                                </button>
                                <div className="absolute bottom-3 left-3 bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                                    TOP SOTUV
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-1 mb-2">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                                    <span className="text-xs text-gray-500">({product.reviews})</span>
                                </div>

                                <h3
                                    className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors line-clamp-2 min-h-[3rem] cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {product.name}
                                </h3>

                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Store size={14} className="text-teal-600" />
                                        <span className="font-medium">{product.shop}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span>{product.region}</span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 line-through">1,500,000 so'm</span>
                                            <span className="text-xl font-extrabold text-teal-600">{product.price} <span className="text-xs">so'm</span></span>
                                        </div>
                                        <button className="p-3 rounded-2xl bg-[#2b7d78] text-white hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-teal-600/20">
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => toast.success("Savatga qo'shildi")}
                                            className="py-2.5 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            Savatga qo'shish
                                        </button>
                                        <button
                                            onClick={() => handlePurchase(product)}
                                            className="py-2.5 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
                                        >
                                            Sotib olish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
