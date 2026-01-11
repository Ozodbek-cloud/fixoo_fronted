"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LangSwitch from "./LangSwitch";
import Image from "next/image";
import {
    UserPlus,
    Store,
    User,
    Hammer,
    ShoppingBag,
    LogOut,
    Settings,
    Menu,
    X,
    ClipboardList,
    LayoutDashboard
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar({ onViewChange }: { onViewChange?: (view: string) => void }) {
    const router = useRouter();
    const t = useTranslations();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [userData, setUserData] = useState<{ firstName: string; lastName: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole");
        const mockUser = localStorage.getItem("currentUser");

        if (token) {
            setIsLoggedIn(true);
            setUserRole(role);
            fetchUserProfile(token);
        } else if (role === 'SELLER' && mockUser) {
            // Handle mock seller login
            setIsLoggedIn(true);
            setUserRole('SELLER');
            const parsedUser = JSON.parse(mockUser);
            setUserData({
                firstName: parsedUser.shopName,
                lastName: ''
            });
        }
    }, []);

    const fetchUserProfile = async (token: string) => {
        try {
            const response = await axios.get("https://fixoo-backend.onrender.com/api/v1/my/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setUserRole(null);
        setUserData(null);
        router.push("/");
    };

    const getInitials = () => {
        if (!userData) return "";
        return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    };

    const navLinks = [
        { href: "/", label: t("home", { defaultMessage: "Bosh sahifa" }), icon: <LayoutDashboard size={18} /> },
        { href: "/masters-feed", label: t("masters_feed", { defaultMessage: "Ustalar" }), icon: <Hammer size={18} /> },
        { href: "/marketplace", label: t("marketplace", { defaultMessage: "Bozor" }), icon: <ShoppingBag size={18} /> },
    ];

    const roleLinks: { href: string; label: string; icon: React.ReactNode; onClick?: () => void }[] = userRole === "MASTER" ? [
        {
            href: "/orders",
            label: t("orders", { defaultMessage: "Buyurtmalar" }),
            icon: <ClipboardList size={18} />,
            onClick: () => onViewChange ? onViewChange("orders") : router.push("/orders")
        },
    ] : userRole === "USER" ? [
        {
            href: "/orders",
            label: t("orders", { defaultMessage: "Buyurtmalar" }),
            icon: <ClipboardList size={18} />,
            onClick: () => onViewChange ? onViewChange("orders") : router.push("/orders")
        },
    ] : userRole === "SHOP" || userRole === "SELLER" ? [
        { href: "/shop-dashboard", label: t("my_shop", { defaultMessage: "Do'konim" }), icon: <Store size={18} /> },
    ] : [];

    return (
        <header className="bg-teal-700 text-white px-4 py-3 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/fixoo.png"
                            alt="Fixoo Icon"
                            width={40}
                            height={40}
                            className="brightness-0 invert"
                        />
                        <span className="text-2xl md:text-3xl font-bold">Fixoo</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm p-2 rounded-2xl font-medium hover:bg-white text-teal-200 transition-colors duration-500 flex items-center gap-2">
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                    {isLoggedIn && roleLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={link.onClick || (() => router.push(link.href))}
                            className="text-sm font-medium hover:text-teal-200 transition-colors flex items-center gap-2"
                        >
                            {link.icon}
                            {link.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <LangSwitch />
                    </div>

                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/register?role=MASTER')}
                                className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/20 font-bold text-sm transition-all border border-white/20 shadow-lg flex items-center gap-2"
                            >
                                <UserPlus size={18} />
                                <span className="hidden md:inline">{t("become_master", { defaultMessage: "Usta bo'lish" })}</span>
                            </button>
                            <button
                                onClick={() => router.push('/register?role=SHOP')}
                                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-teal-400 hover:to-teal-500 font-bold text-sm transition-all shadow-lg shadow-teal-900/20 border border-teal-400/30 flex items-center gap-2"
                            >
                                <Store size={18} />
                                <span className="hidden md:inline">{t("open_shop", { defaultMessage: "Do'kon ochish" })}</span>
                            </button>
                        </div>
                    ) : userRole === 'SELLER' ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/shop-dashboard')}
                                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-teal-400 hover:to-teal-500 font-bold text-sm transition-all shadow-lg shadow-teal-900/20 border border-teal-400/30 flex items-center gap-2"
                            >
                                <Store size={18} />
                                <span className="hidden md:inline">{t("my_shop", { defaultMessage: "Do'konim" })}</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/20"
                                >
                                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold border border-white/30">
                                        {getInitials() || <User size={16} />}
                                    </div>
                                </button>
                                {/* Profile menu remains same */}
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/20"
                            >
                                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold border border-white/30">
                                    {getInitials() || <User size={16} />}
                                </div>
                                <span className="hidden md:inline text-sm font-medium">
                                    {userData ? `${userData.firstName} ${userData.lastName}` : userRole}
                                </span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 text-gray-800 border border-gray-100 animate-fade-in-up overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{userRole}</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {userData ? `${userData.firstName} ${userData.lastName}` : "Foydalanuvchi"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (onViewChange) {
                                                onViewChange('profile');
                                            } else {
                                                router.push('/');
                                            }
                                            setShowProfileMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-colors"
                                    >
                                        <User size={18} className="text-teal-600" />
                                        <span className="font-medium">{t('profile', { defaultMessage: 'Profil' })}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/setting');
                                            setShowProfileMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-colors"
                                    >
                                        <Settings size={18} className="text-teal-600" />
                                        <span className="font-medium">{t('settings', { defaultMessage: 'Sozlamalar' })}</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors mt-1 border-t border-gray-100"
                                    >
                                        <LogOut size={18} className="text-red-500" />
                                        <span className="font-medium">{t('logout', { defaultMessage: 'Chiqish' })}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal-600 transition-colors">
                    <LayoutDashboard size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t("home")}</span>
                </Link>
                <Link href="/masters-feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal-600 transition-colors">
                    <Hammer size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t("masters_feed")}</span>
                </Link>
                <Link href="/marketplace" className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal-600 transition-colors">
                    <ShoppingBag size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t("marketplace")}</span>
                </Link>
                <Link href="/orders" className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal-600 transition-colors">
                    <ClipboardList size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t("orders")}</span>
                </Link>
            </div>
        </header>
    );
}
