"use client";

import { useRouter, usePathname } from "next/navigation";
import { Logout } from "@/features";
import { useUserStore } from "@/shared/auth/useUserStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userName } = useUserStore();

  // 경로별 테마 정의
  const getThemeByPath = (path: string) => {
    if (path === '/') {
      return {
        text: "text-white hover:text-yellow-300",
        logo: "text-white",
        background: ""
      };
    }
    
    return {
      text: "text-gray-800 hover:text-blue-600",
      logo: "text-gray-800",
      background: "bg-white/90 backdrop-blur-sm"
    };
  };

  const currentTheme = getThemeByPath(pathname);
  const NAV_ITEMS = `${currentTheme.text} font-medium transition-colors cursor-pointer`;

  return (
    <header className={`absolute z-20 pt-5 w-full ${currentTheme.background}`}>
      <div className="container mx-auto px-5">
        <nav className="flex justify-between items-center">
          <div 
            onClick={() => router.push("/")} 
            className={`flex items-center gap-3 ${currentTheme.logo} text-3xl font-bold cursor-pointer transition-colors`}
          >
            webee
          </div>
          <ul className="hidden md:flex gap-8">
            <li>
              <div onClick={() => router.push("/search")} className={NAV_ITEMS}>
                업체검색
              </div>
            </li>
            <li>
              <div onClick={() => router.push("/diagnosis")} className={NAV_ITEMS}>
                질병진단
              </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/recommendbee")}
          >
            수정벌 추천
          </div>
            </li>
            {userName && (
              <li>
                <div onClick={() => router.push("/mypage")} className={NAV_ITEMS}>
                  마이페이지
                </div>
              </li>
            )}
            <li className={NAV_ITEMS}>
              <Logout />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}