'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

import russiaFlag from '../../../public/images/languages/russia.png';
import uzbekFlag from '../../../public/images/languages/uzbekistan.png';
import kazakhFlag from '../../../public/images/languages/kazak.png';
import kyrgyzFlag from '../../../public/images/languages/kirgizz.png';
import karakalpakFlag from '../../../public/images/languages/karakalpak-flag.png';

type Language = {
  name: string;
  code: 'uz' | 'ru' | 'kk' | 'ky' | 'kaa';
  flag: any;
};

const languages: Language[] = [
  { name: 'O\'zbekcha', code: 'uz', flag: uzbekFlag },
  { name: 'Русский', code: 'ru', flag: russiaFlag },
  { name: 'Қазақша', code: 'kk', flag: kazakhFlag },
  { name: 'Кыргызча', code: 'ky', flag: kyrgyzFlag },
  { name: 'Қарақалпақша', code: 'kaa', flag: karakalpakFlag },
];

const LangSwitch: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const initialSelected = languages.find(lang => lang.code === currentLocale) || languages[0];

  const [selected, setSelected] = useState<Language>(initialSelected);
  const [open, setOpen] = useState<boolean>(false);

  const handleLanguageChange = (code: 'uz' | 'ru' | 'kk' | 'ky' | 'kaa') => {
    if (!pathname) return;

    const segments = pathname.split('/');
    segments[1] = code;
    const newPath = segments.join('/');

    setSelected(languages.find(lang => lang.code === code)!);
    setOpen(false);
    router.push(newPath);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-3 hover:bg-white/20 transition-all duration-200 min-w-[110px] md:min-w-[160px] shadow-lg"
      >
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full overflow-hidden border border-white/30">
            <Image src={selected.flag} alt={selected.name} width={24} height={24} className="object-cover" />
          </div>
          <span className="font-medium text-xs md:text-sm">{selected.name}</span>
        </div>
        <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[200px] overflow-hidden">
            {languages.map((lang, index) => (
              <div
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-4 py-3 hover:bg-teal-50 cursor-pointer flex items-center gap-3 transition-colors ${
                  selected.code === lang.code ? 'bg-teal-100 text-teal-700' : 'text-gray-700'
                } ${index !== languages.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border border-gray-200">
                    <Image src={lang.flag} alt={lang.name} width={24} height={24} className="object-cover" />
                  </div>
                <span className="font-medium">{lang.name}</span>
                {selected.code === lang.code && (
                  <svg className="w-4 h-4 ml-auto text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LangSwitch;

