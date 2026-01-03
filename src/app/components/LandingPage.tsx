"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import { Footer } from './Footer';
import AdvancedSearch, { SearchFilters } from './AdvancedSearch';
import MasterList from './MasterList';
import MasterDetailsModal from './MasterDetailsModal';
import BookingModal from './BookingModal';
import Navbar from './Navbar';
import MasterProfile from './MasterProfile';
import OrdersView from './OrdersView';
import { Master, mockMasters } from '@/data/masters';

interface addsInter {
    text: string,
    photoUrl: string,
    serverLink: string
}

export default function LandingPage() {
    const router = useRouter();
    const t = useTranslations();
    const [adds, setAdds] = useState<addsInter[]>([]);
    const [activeView, setActiveView] = useState("home"); // home, profile, orders

    // Search and Booking State
    const [filteredMasters, setFilteredMasters] = useState<Master[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVkY2RmOTgxLWE5NjktNDNmMS1hM2UwLTExM2M2YThkOTM0ZSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2NTU0MjA3MCwiZXhwIjoxNzY4MjIwNDcwfQ.5vPEvRv5AV4hsAe6GvkzBPQu6vYgFu_8fM-jauUhAfA";

        axios.get("https://fixoo-backend.onrender.com/advert", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setAdds(res.data);
            })
            .catch(err => {
                console.log("Error:", err);
            });
    }, []);

    const handleSearch = (filters: SearchFilters) => {
        setIsSearching(true);
        const results = mockMasters.filter(master => {
            const matchName = !filters.name ||
                master.firstName.toLowerCase().includes(filters.name.toLowerCase()) ||
                master.lastName.toLowerCase().includes(filters.name.toLowerCase());
            const matchProfession = !filters.profession || master.profession === filters.profession;
            const matchRegion = !filters.region || master.region === filters.region;
            const matchDistrict = !filters.district || master.district === filters.district;

            return matchName && matchProfession && matchRegion && matchDistrict;
        });
        setFilteredMasters(results);
    };

    const handleDetails = (master: Master) => {
        setSelectedMaster(master);
        setIsDetailsOpen(true);
    };

    const handleContact = (master: Master) => {
        setSelectedMaster(master);
        setIsBookingOpen(true);
        setIsDetailsOpen(false);
    };

    const renderContent = () => {
        switch (activeView) {
            case "profile":
                return <MasterProfile />;
            case "orders":
                return <OrdersView />;
            default:
                return (
                    <>
                        <HeroSection />
                        <div className="container mx-auto px-4 mb-20 mt-10">
                            <AdvancedSearch onSearch={handleSearch} />
                            {isSearching && (
                                <div className="mt-12 animate-fade-in-up">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                                        {t('landing.search_results', { defaultMessage: 'Qidiruv natijalari' })}
                                    </h2>
                                    <MasterList
                                        masters={filteredMasters}
                                        onDetails={handleDetails}
                                        onContact={handleContact}
                                    />
                                </div>
                            )}
                        </div>
                        <FeaturedProducts />
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar onViewChange={(view) => setActiveView(view)} />

            <main>
                {activeView !== "home" && (
                    <div className="max-w-5xl mx-auto px-4 pt-8">
                        <button
                            onClick={() => setActiveView("home")}
                            className="text-teal-600 font-bold flex items-center gap-2 hover:text-teal-700 transition-colors"
                        >
                            ← Asosiy sahifaga qaytish
                        </button>
                    </div>
                )}
                {renderContent()}
            </main>

            <Footer />

            {/* Modals */}
            {isDetailsOpen && selectedMaster && (
                <MasterDetailsModal
                    master={selectedMaster}
                    onClose={() => setIsDetailsOpen(false)}
                    onContact={() => handleContact(selectedMaster)}
                />
            )}

            {isBookingOpen && selectedMaster && (
                <BookingModal
                    master={selectedMaster}
                    onClose={() => setIsBookingOpen(false)}
                />
            )}

            <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
        </div>
    );
}