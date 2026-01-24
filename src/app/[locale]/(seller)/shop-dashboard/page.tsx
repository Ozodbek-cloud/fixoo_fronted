'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    ShoppingBag,
    ClipboardList,
    Plus,
    TrendingUp,
    Users,
    DollarSign,
    Package,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    Filter
} from 'lucide-react';

type ProductRow = {
    name: string;
    unit: string;
    size: string;
    quantity: string;
    category: string;
    images: File[];
};

import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ShopDashboardPage() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: '',
        image: '',
        weight: '',
        weightUnit: 'kg',
        volume: '',
        volumeUnit: 'l',
        length: '',
        lengthUnit: 'm'
    });

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(true);

    const [rows, setRows] = useState<ProductRow[]>([
        {
            name: "",
            unit: "",
            size: "",
            quantity: "",
            category: "",
            images: [],
        },
    ]);

    const updateRow = <K extends keyof ProductRow>(
        index: number,
        field: K,
        value: ProductRow[K]
    ) => {
        setRows(prev =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };

    const addRow = () => {
        setRows(prev => [
            ...prev,
            {
                name: "",
                unit: "",
                size: "",
                quantity: "",
                category: "",
                images: [],
            },
        ]);
    };

    const handleImageUpload = (index: number, files: FileList | null) => {
        if (!files) return;
        setRows(prev =>
            prev.map((row, i) =>
                i === index
                    ? { ...row, images: [...row.images, ...Array.from(files)] }
                    : row
            )
        );
    };

    const emptyRow = {
        name: "",
        unit: "",
        size: "",
        quantity: "",
        price: "",
        category: "",
        imageCount: 0,
    };

    useEffect(() => {
        // Load mock data
        const mockProds = [
            { id: 1, name: 'Makita DHP482Z', price: '1,200,000', category: 'Asboblar', sales: 45, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop' },
            { id: 2, name: 'Bosch GWS 9-115', price: '850,000', category: 'Asboblar', sales: 32, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop' },
        ];
        const mockOrds = [
            { id: 101, customer: 'Ali Valiyev', product: 'Makita DHP482Z', amount: '1,200,000', status: 'PENDING', date: '2026-01-02' },
            { id: 102, customer: 'Olim Toshov', product: 'Bosch GWS 9-115', amount: '850,000', status: 'COMPLETED', date: '2026-01-01' },
        ];
        setProducts(mockProds);
        setOrders(mockOrds);
    }, []);

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const product = { ...newProduct, id: Date.now(), sales: 0 };
        setProducts([...products, product]);
        setIsAddProductModalOpen(false);
        setNewProduct({
            name: '',
            price: '',
            category: '',
            image: '',
            weight: '',
            weightUnit: 'kg',
            volume: '',
            volumeUnit: 'l',
            length: '',
            lengthUnit: 'm'
        });
        toast.success("Mahsulot qo'shildi!");
    };

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
        toast.info("Mahsulot o'chirildi");
    };

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        toast.success(`Buyurtma holati o'zgartirildi: ${newStatus}`);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Boshqaruv Paneli</h1>
                        <p className="text-gray-500 font-medium">Do'koningiz faoliyatini kuzatib boring va boshqaring</p>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LayoutDashboard size={20} />
                            Statistika
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Package size={20} />
                            Mahsulotlar
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <ClipboardList size={20} />
                            Buyurtmalar
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'stats' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                    <DollarSign size={28} />
                                </div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Umumiy Savdo</p>
                                <h3 className="text-2xl font-black text-gray-900">45,200,000 UZS</h3>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-bold mt-2">
                                    <TrendingUp size={16} />
                                    +12.5%
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <ShoppingBag size={28} />
                                </div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Buyurtmalar</p>
                                <h3 className="text-2xl font-black text-gray-900">124 ta</h3>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-bold mt-2">
                                    <TrendingUp size={16} />
                                    +8.2%
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Users size={28} />
                                </div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Mijozlar</p>
                                <h3 className="text-2xl font-black text-gray-900">89 ta</h3>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-bold mt-2">
                                    <TrendingUp size={16} />
                                    +5.1%
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Package size={28} />
                                </div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Mahsulotlar</p>
                                <h3 className="text-2xl font-black text-gray-900">{products.length} ta</h3>
                                <p className="text-gray-400 text-sm font-bold mt-2">Faol sotuvda</p>
                            </div>
                        </div>

                        {/* Charts Area (Mock) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-8">Eng ko'p sotilgan mahsulotlar</h3>
                                <div className="space-y-6">
                                    {products.map((p, idx) => (
                                        <div key={p.id} className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-gray-700">{p.name}</span>
                                                <span className="text-teal-600">{p.sales} ta</span>
                                            </div>
                                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-teal-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${(p.sales / 50) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-8">Haftalik savdo dinamikasi</h3>
                                <div className="flex items-end justify-between h-48 gap-2">
                                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-teal-500/20 hover:bg-teal-500 transition-all rounded-t-xl cursor-help group relative border-b-2 border-teal-500"
                                                style={{ height: `${h}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {h * 100}k UZS
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Mahsulotlarni qidirish..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <button
                                onClick={() => setIsAddProductModalOpen(true)}
                                className="bg-teal-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center gap-2"
                            >
                                <Plus size={24} />
                                Yangi mahsulot
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <div key={p.id} className="bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                                    <div className="relative aspect-square rounded-3xl overflow-hidden mb-5 bg-gray-50">
                                        <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="px-2">
                                        <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">{p.category}</span>
                                        <h3 className="text-xl font-black text-gray-900 mt-2 mb-1">{p.name}</h3>
                                        <p className="text-2xl font-black text-teal-600 mb-6">{p.price} <span className="text-sm font-bold">UZS</span></p>

                                        <div className="flex gap-2">
                                            <button className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                                <Edit size={18} />
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white  rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Barcha buyurtmalar</h3>
                            <button className="flex items-center gap-2 text-gray-400 hover:text-teal-600 font-bold transition-colors">
                                <Filter size={18} />
                                Saralash
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">ID</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Mijoz</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Mahsulot</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Summa</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Holat</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((o) => (
                                        <tr key={o.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-6 font-bold text-gray-400">#{o.id}</td>
                                            <td className="px-8 py-6 font-black text-gray-900">{o.customer}</td>
                                            <td className="px-8 py-6 font-bold text-gray-600">{o.product}</td>
                                            <td className="px-8 py-6 font-black text-teal-600">{o.amount} UZS</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${o.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                                    o.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    {o.status === 'COMPLETED' ? 'Yetkazildi' : o.status === 'PENDING' ? 'Kutilmoqda' : 'Bekor qilindi'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateOrderStatus(o.id, 'COMPLETED')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                                                        title="Yetkazildi deb belgilash"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(o.id, 'CANCELLED')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                                        title="Bekor qilish"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            {isAddProductModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsAddProductModalOpen(false)}
                    />

                    <div className="relative bg-white w-full max-w-6xl rounded-[2.5rem] p-8 shadow-2xl">
                        <h2 className="text-2xl font-black mb-6">
                            DO‘KON UCHUN MAHSULOT QO‘SHISH
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500">
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Unit</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                        <th>Category</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {rows.map((row, i) => (
                                        <tr key={i} className="bg-gray-50">
                                            <td className="p-3 font-bold">{i + 1}</td>

                                            <td className="p-3">
                                                <input
                                                    className="input"
                                                    value={row.name}
                                                    onChange={e =>
                                                        updateRow(i, "name", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-3">
                                                <select
                                                    className="input"
                                                    value={row.unit}
                                                    onChange={e =>
                                                        updateRow(i, "unit", e.target.value)
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="dona">dona</option>
                                                    <option value="m">m</option>
                                                    <option value="kg">kg</option>
                                                </select>
                                            </td>

                                            <td className="p-3">
                                                <input
                                                    className="input"
                                                    value={row.size}
                                                    onChange={e =>
                                                        updateRow(i, "size", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-3">
                                                <input
                                                    className="input"
                                                    value={row.quantity}
                                                    onChange={e =>
                                                        updateRow(i, "quantity", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-3">
                                                <select
                                                    className="input"
                                                    value={row.category}
                                                    onChange={e =>
                                                        updateRow(i, "category", e.target.value)
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Santexnika">Santexnika</option>
                                                    <option value="Qurilish mollari">
                                                        Qurilish mollari
                                                    </option>
                                                </select>
                                            </td>

                                            <td className="p-3">
                                                <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-xl font-bold text-sm inline-block">
                                                    ☁ Upload ({row.images.length})
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={e =>
                                                            handleImageUpload(i, e.target.files)
                                                        }
                                                    />
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={addRow}
                                className="text-blue-600 font-bold"
                            >
                                ➕ Add new product row
                            </button>

                            <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">
                                💾 Save all products
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <ToastContainer position="bottom-right" />
        </div>
    );
}
