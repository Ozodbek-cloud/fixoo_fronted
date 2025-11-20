"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LangSwitch from "./LangSwitch";
import Image from "next/image";


const SpecialistNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const navigationItems = [
    {
      key: "home",
      label: t("navigation.home"),
      path: "/homespecialist",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      key: "search",
      label: t("navigation.specialist_search"),
      path: "/searchspecialist",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      key: "orders",
      label: t("navigation.orders"),
      path: "/orders",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      key: "settings",
      label: t("navigation.settings"),
      path: "/setting",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAvailable");
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <>
      {/* Desktop/Tablet Navigation - Top Bar */}
      <nav className="hidden md:block bg-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/fixoo_icon.png"
                  alt="Fixoo Icon"
                  width={50}
                  height={50}
                  style={{ width: 'auto', height: 'auto' }}
                />
                <span className="text-3xl font-bold">Fixoo</span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-teal-100 hover:bg-teal-600 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Side - Language Switch and Logout */}
            <div className="flex items-center space-x-4">
              <LangSwitch />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-teal-100 hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-teal-600 border-t border-teal-700 shadow-lg z-50">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive(item.path)
                  ? "text-white bg-teal-700"
                  : "text-teal-100 hover:text-white hover:bg-teal-700"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium truncate px-1">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Top Bar - Only Language Switch and Logout */}
      <nav className="md:hidden bg-teal-700 text-white shadow-lg sticky top-0 z-40">
        <div className="flex justify-between items-center px-4 h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Fixoo</span>
          </div>

          {/* Right Side - Language Switch and Logout */}
          <div className="flex items-center space-x-3">
            <LangSwitch />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-teal-100 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for mobile bottom navigation */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default SpecialistNavigation;
