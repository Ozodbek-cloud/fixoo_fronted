'use client';

import Navbar from '../../components/Navbar';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="pb-20 md:pb-0">
                {children}
            </main>
        </>
    );
}
