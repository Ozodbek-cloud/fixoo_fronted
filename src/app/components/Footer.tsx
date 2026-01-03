import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-teal-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/fixoo.png"
                                    alt="Fixoo Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                            <span className="text-2xl font-bold text-white">Fixoo</span>
                        </Link>
                        <p className="text-teal-100/80 leading-relaxed">
                            {t('landing.footer_desc', { defaultMessage: "O'zbekistondagi eng yirik ustalar va xizmatlar platformasi. Uyingiz uchun eng yaxshi yechimlar." })}
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer border border-teal-700">
                                    <Icon className="w-5 h-5 text-teal-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">{t('platform', { defaultMessage: 'Platforma' })}</h3>
                        <ul className="space-y-4 text-teal-100/70">
                            <li><Link href="#" className="hover:text-white transition-colors">{t('about', { defaultMessage: 'Biz haqimizda' })}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.how_it_works', { defaultMessage: 'Qanday ishlaydi' })}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.security', { defaultMessage: 'Xavfsizlik' })}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.terms', { defaultMessage: 'Foydalanish shartlari' })}</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">{t('services_title', { defaultMessage: 'Xizmatlar' })}</h3>
                        <ul className="space-y-4 text-teal-100/70">
                            <li><Link href="#" className="hover:text-white transition-colors">{t('services.plumbing', { defaultMessage: 'Santexnika' })}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('services.electrical', { defaultMessage: 'Elektr montaj' })}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('services.household_appliances', { defaultMessage: 'Maishiy texnika' })}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('services.cleaning', { defaultMessage: 'Tozalash' })}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">{t('contact', { defaultMessage: 'Bog\'lanish' })}</h3>
                        <ul className="space-y-4 text-teal-100/70">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-teal-400 w-5 h-5 mt-1 shrink-0" />
                                <span>{t('footer.address_text', { defaultMessage: 'Toshkent sh., Chilonzor tumani, Bunyodkor ko\'chasi' })}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-teal-400 w-5 h-5 shrink-0" />
                                <span>+998 90 123 45 67</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-teal-400 w-5 h-5 shrink-0" />
                                <span>support@fixoo.uz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-teal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-teal-100/50 text-sm">
                    <p>© {new Date().getFullYear()} Fixoo. {t('footer.all_rights_reserved', { defaultMessage: 'Barcha huquqlar himoyalangan.' })}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">{t('footer.privacy', { defaultMessage: 'Maxfiylik siyosati' })}</Link>
                        <Link href="#" className="hover:text-white transition-colors">{t('footer.terms', { defaultMessage: 'Foydalanish shartlari' })}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
