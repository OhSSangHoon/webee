"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import HeaderDropdown from "./HeaderDropdown";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full h-[100px] flex items-center justify-center relative">
      <Link href="/" aria-label="홈으로 이동">
        <Image src="/webee.svg" alt="Webee 로고" width={100} height={100} priority/>
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