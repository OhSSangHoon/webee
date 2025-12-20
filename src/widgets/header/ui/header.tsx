"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import HeaderDropdown from "./HeaderDropdown";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 w-full h-[80px] flex items-center justify-center bg-white z-50 border-b border-gray-300">
      <Link href="/" aria-label="홈으로 이동">
        <div className="text-2xl font-bold text-main-900">webee</div>
      </Link>
      <HeaderDropdown isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
          role="button"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Menu
              size={25}
              className={`absolute text-black transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}
            />
            <X
              size={25}
              className={`absolute text-black transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}
            />
          </div>
        </div>
      </HeaderDropdown>
    </header>
  );
}
