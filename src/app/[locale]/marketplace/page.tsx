'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { ShoppingCart, Heart, Star, MapPin, Store, Search, X, CheckCircle2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

// 1. Mahsulot uchun interfeys (TypeScript)
interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    shop: string;
    region: string;
    rating: number;
    reviews: number;
    description: string;
    sizes?: string[];
}

// 2. Ma'lumotlar (Hozircha bo'sh, xabarni tekshirish uchun)
const mockProducts: Product[] = [
    // Agar bu yerga mahsulot qo'shsangiz, grid ko'rinadi
    // {
    //     id: 1,
    //     name: "Beton qorishtirgich 180L",
    //     price: "1,200,000",
    //     image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800",
    //     shop: "Stroy Market",
    //     region: "Toshkent",
    //     rating: 4.8,
    //     reviews: 124,
    //     description: "Professional qurilish ishlari uchun.",
    //     sizes: ["180L", "250L"]
    // }
];

export default function Marketplace() {
    const t = useTranslations();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handlePurchase = (product: Product) => {
        toast.success("Sotib olish rasmiylashtirildi!", {
            icon: <CheckCircle2 className="text-white" />
        });
        console.log(`Order: ${product.name} from ${product.shop}`);
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
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                            {t('marketplace', { defaultMessage: 'Bozor' })}
                        </h1>
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

                {/* Products Grid yoki Empty State */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
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
                                            <button className="p-3 rounded-2xl bg-[#2b7d78] text-white hover:bg-teal-700 transition-all duration-300">
                                                <ShoppingCart size={20} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => toast.success("Savatga qo'shildi")} className="py-2.5 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100">
                                                Savatga qo'shish
                                            </button>
                                            <button onClick={() => handlePurchase(product)} className="py-2.5 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700">
                                                Sotib olish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={48} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Hozircha mahsulotlar yo'q</h2>
                        <p className="text-gray-500 mt-2 max-w-sm">
                            {searchQuery ? `"${searchQuery}" bo'yicha hech narsa topilmadi.` : "Tez orada yangi mahsulotlar qo'shiladi. Bizni kuzatishda davom eting!"}
                        </p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="mt-6 text-teal-600 font-bold hover:underline">
                                Barcha mahsulotlarni ko'rish
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
                            <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center border-r">
                                <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg">
                                    <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                                </div>
                            </div>

                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full uppercase">Yangi</span>
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold text-gray-900">{selectedProduct.rating}</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{selectedProduct.name}</h2>

                                <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5"><Store size={18} className="text-teal-600" /> <b>{selectedProduct.shop}</b></div>
                                    <div className="flex items-center gap-1.5"><MapPin size={18} /> <span>{selectedProduct.region}</span></div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tavsif</h4>
                                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                                </div>

                                <div className="mt-auto pt-8 border-t border-gray-100">
                                    <div className="flex items-end justify-between mb-6">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 mb-1">Narxi:</p>
                                            <h3 className="text-3xl font-black text-teal-600">
                                                {selectedProduct.price} <span className="text-lg font-bold">so'm</span>
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button onClick={() => toast.success("Savatga qo'shildi")} className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                                            <ShoppingBag size={20} /> Savatga qo'shish
                                        </button>
                                        <button onClick={() => handlePurchase(selectedProduct)} className="flex items-center justify-center gap-2 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg transform hover:-translate-y-0.5">
                                            <ShoppingCart size={20} /> Sotib olish
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