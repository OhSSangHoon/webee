"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";


export default function Header() {
  return (
    <header className="w-full h-[100px] flex items-center justify-center relative">
      <Link href="/" aria-label="홈으로 이동">
        <Image src="/webee.svg" alt="Webee 로고" width={100} height={100} priority/>
      </Link>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer">
        <Menu size={25} className="text-black"/>
      </div>
    </header>
  );
}