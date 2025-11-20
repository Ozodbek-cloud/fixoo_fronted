"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LangSwitch from "./LangSwitch";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const t = useTranslations();

  const handleRegister = () => {
    router.push("/register?role=MASTER");
  };

  return (
    <header className="bg-teal-700 text-white px-4 py-3 shadow-md relative z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <div className="flex items-center gap-2">
            <Image
              src="/fixoo.png"
              alt="Fixoo Icon"
              width={50}
              height={50}
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="text-3xl font-bold">Fixoo</span>
          </div>
        </Link>

        {/* Menu - always visible */}
        <nav className="flex space-x-2 md:space-x-6 items-center">
          <div>
            <LangSwitch />
          </div>
          <button
            onClick={handleRegister}
            className="bg-white text-teal-700 px-2 py-1.5 md:px-4 md:py-2 rounded hover:bg-gray-100 font-medium text-xs md:text-base"
          >
            <span className="block md:hidden">Ro'yxat</span>
            <span className="hidden md:block">{t("register")}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
