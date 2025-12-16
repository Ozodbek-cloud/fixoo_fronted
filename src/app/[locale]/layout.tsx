// src/app/[locale]/layout.tsx
'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';
import React from 'react';
import "../../../public/styles/globals.css";
import Navbar from '../components/Navbar';
import SpecialistNavigation from '../components/SpecialistNavigation';
import ClientNavigation from '../components/ClientNavigation';
import HammerLoader from '../components/HammerLoader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function LocaleLayout({ children, params }: Props) {
  const { locale } = React.use(params);
  const pathname = usePathname();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  // Check user role on mount and pathname change
  React.useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [pathname]);

  // Pages where no navigation should be shown
  const publicPages = ['/', '/login', '/register', '/verify-phone', '/reset-password','/newpassword'];
  
  // Pages that should use specialist navigation
  const specialistPages = ['/homespecialist', '/orders'];
  
  // Pages that should use client navigation
  const clientPages = ['/homeclient'];
  
  // Shared pages that use role-based navigation
  const sharedPages = ['/searchspecialist', '/setting', 'about_master'];
  
  const shouldShowNavbar = !publicPages.some(page => 
    pathname === `/${locale}${page}` || pathname === `/${locale}${page}/`
  );
  
  const shouldShowSpecialistNav = shouldShowNavbar && (
    specialistPages.some(page => pathname.includes(page)) ||
    (sharedPages.some(page => pathname.includes(page)) && userRole === 'MASTER')
  );
  
  const shouldShowClientNav = shouldShowNavbar && (
    clientPages.some(page => pathname.includes(page)) ||
    (sharedPages.some(page => pathname.includes(page)) && userRole === 'USER')
  );

  // For loading messages, we'll need to handle this asynchronously
  const [messages, setMessages] = React.useState<any>(null);

  React.useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageModule = await import(`../../../messages/${locale}.json`);
        setMessages(messageModule.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to empty messages
        setMessages({});
      }
    };
    loadMessages();
  }, [locale]);

  if (!messages) {
    // Show loading state while messages are loading
    return (
      <html lang={locale}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <HammerLoader fullScreen={true} showText={true} text="Loading..." />
        </body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {shouldShowSpecialistNav ? (
            <SpecialistNavigation />
          ) : shouldShowClientNav ? (
            <ClientNavigation />
          ) : shouldShowNavbar ? (
            <Navbar />
          ) : null}
          <main className={shouldShowSpecialistNav || shouldShowClientNav ? 'md:pt-0 pb-20 md:pb-0' : ''}>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
