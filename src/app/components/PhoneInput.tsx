"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Country {
  code: string;
  name: string;
  prefix: string;
  flag: string;
  format: string;
  placeholder: string;
  maxDigits: number;
}

const countries: Country[] = [
  {
    code: "UZ",
    name: "O'zbekiston",
    prefix: "+998",
    flag: "/images/languages/uzbekistan.png",
    format: "## ### ## ##",
    placeholder: "90 123 45 67",
    maxDigits: 9
  },
  {
    code: "KG",
    name: "Qirg'iziston",
    prefix: "+996",
    flag: "/images/languages/kirgizz.png",
    format: "### ### ###",
    placeholder: "555 123 456",
    maxDigits: 9
  },
  {
    code: "RU",
    name: "Rossiya",
    prefix: "+7",
    flag: "/images/languages/russia.png",
    format: "### ### ## ##",
    placeholder: "900 123 45 67",
    maxDigits: 10
  },
  {
    code: "KZ",
    name: "Qozog'iston",
    prefix: "+7",
    flag: "/images/languages/kazak.png",
    format: "### ### ## ##",
    placeholder: "701 123 45 67",
    maxDigits: 10
  }
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
  initialCountry?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  error = false,
  initialCountry = "UZ"
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === initialCountry) || countries[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract phone number from full value
  useEffect(() => {
    if (value && value.startsWith(selectedCountry.prefix)) {
      const phoneOnly = value.substring(selectedCountry.prefix.length).trim();
      setPhoneNumber(phoneOnly);
    } else if (!value || value === selectedCountry.prefix) {
      setPhoneNumber("");
    } else {
      // If value doesn't start with current prefix, try to detect country and extract
      const detectedCountry = countries.find(country => value.startsWith(country.prefix));
      if (detectedCountry && detectedCountry.code !== selectedCountry.code) {
        setSelectedCountry(detectedCountry);
        const phoneOnly = value.substring(detectedCountry.prefix.length).trim();
        setPhoneNumber(phoneOnly);
      }
    }
  }, [value, selectedCountry.prefix]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const formatPhoneNumber = (input: string, format: string, maxDigits: number) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '').substring(0, maxDigits);

    // Apply format
    let formatted = '';
    let digitIndex = 0;

    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === '#') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Remove any prefix that might have been pasted
    if (input.startsWith(selectedCountry.prefix)) {
      input = input.substring(selectedCountry.prefix.length).trim();
    }

    const formatted = formatPhoneNumber(input, selectedCountry.format, selectedCountry.maxDigits);
    setPhoneNumber(formatted);

    // Always send the full formatted number with prefix
    if (formatted.trim()) {
      onChange(`${selectedCountry.prefix} ${formatted}`);
    } else {
      onChange("");
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);

    // Extract only digits from current phone number and reformat for new country
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const formatted = formatPhoneNumber(digitsOnly, country.format, country.maxDigits);
    setPhoneNumber(formatted);

    if (formatted.trim()) {
      onChange(`${country.prefix} ${formatted}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Telefon raqami {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className={`w-full bg-gray-50 border-0 rounded-xl p-3 sm:py-4 text-gray-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-200 shadow-md focus-within:shadow-lg flex items-center gap-2 ${error ? 'ring-2 ring-red-500 bg-red-50' : ''} ${className}`}>

          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Image
                src={selectedCountry.flag}
                alt={selectedCountry.name}
                width={20}
                height={15}
                className="object-cover rounded-sm"
              />
              <span className="text-sm font-medium">{selectedCountry.prefix}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-2">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Image
                        src={country.flag}
                        alt={country.name}
                        width={24}
                        height={18}
                        className="object-cover rounded-sm"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.prefix}</div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={selectedCountry.placeholder}
            className="flex-1 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-400"
            required={required}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
} 