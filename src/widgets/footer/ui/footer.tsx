"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useChatbotStore } from "@/features/chatBot/model/useChatbotStore";
import { useUserStore } from "@/shared/auth/useUserStore";

export default function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { openChatbot } = useChatbotStore();
  const { isLoggedIn } = useUserStore();

  return (
    <footer className="sticky bottom-0 left-0 w-full h-[90px] flex flex-col items-center py-3 mt-auto bg-white z-50 shadow-[0_-2px_6px_0_rgba(0,0,0,0.06)] rounded-t-3xl">
        <div className="grid grid-cols-4 gap-12">
            <Link 
              href="/"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
              onMouseEnter={() => setHoveredIcon("home")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
                <div className="relative w-[25px] h-[25px]">
                    <Image 
                      src="/home.svg" 
                      alt="홈 아이콘" 
                      width={25} 
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "home" ? "opacity-0" : "opacity-100"}`}
                    />
                    <Image 
                      src="/home_hover.svg" 
                      alt="홈 아이콘" 
                      width={25} 
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "home" ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
                <span className={`text-xs font-medium transition-colors duration-200 ${hoveredIcon === "home" ? "text-main-300" : "text-gray-700"}`}>홈</span>
            </Link>
            <Link 
              href="/search"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
              onMouseEnter={() => setHoveredIcon("trade")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
                <div className="relative w-[25px] h-[25px]">
                    <Image 
                      src="/chat.svg" 
                      alt="거래 아이콘" 
                      width={25} 
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "trade" ? "opacity-0" : "opacity-100"}`}
                    />
                    <Image 
                      src="/chat_hover.svg" 
                      alt="거래 아이콘" 
                      width={25} 
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "trade" ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
                <span className={`text-xs font-medium transition-colors duration-200 ${hoveredIcon === "trade" ? "text-main-300" : "text-gray-700"}`}>거래</span>
            </Link>
            <div 
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
              onMouseEnter={() => setHoveredIcon("chat")}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={openChatbot}
            >
                <div className="relative w-[25px] h-[25px]">
                    <Image 
                      src="/chat.svg" 
                      alt="상담 아이콘" 
                      width={25} 
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "chat" ? "opacity-0" : "opacity-100"}`}
                    />
                    <Image 
                      src="/chat_hover.svg" 
                      alt="상담 아이콘" 
                      width={25} 
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "chat" ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
                <span className={`text-xs font-medium transition-colors duration-200 ${hoveredIcon === "chat" ? "text-main-300" : "text-gray-700"}`}>상담</span>
            </div>
            <Link
              href={isLoggedIn ? "/mypage" : "/signIn"}
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
              onMouseEnter={() => setHoveredIcon("profile")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
                <div className="relative w-[25px] h-[25px]">
                    <Image
                      src="/profile.svg"
                      alt="프로필 아이콘"
                      width={25}
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "profile" ? "opacity-0" : "opacity-100"}`}
                    />
                    <Image
                      src="/profile_hover.svg"
                      alt="프로필 아이콘"
                      width={25}
                      height={25}
                      className={`absolute inset-0 transition-opacity duration-200 ${hoveredIcon === "profile" ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
                <span className={`text-xs font-medium transition-colors duration-200 ${hoveredIcon === "profile" ? "text-main-300" : "text-gray-700"}`}>
                  {isLoggedIn ? "프로필" : "로그인"}
                </span>
            </Link>
        </div>
    </footer>
  );
}