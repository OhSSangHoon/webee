"use client";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "@/features";
import { useUserStore } from "@/shared/auth/useUserStore";
import { useState } from "react";


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userName } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isWhiteNavPage = pathname === "/" || pathname === "/news" || pathname === "/pesticide";

  const getNavStyle = () => {
    return isWhiteNavPage ? "text-white hover:text-yellow-400" : "text-gray-800 hover:text-blue-600";
  }

  const handleMobileMenuClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="absolute top-0 z-20 pt-5 w-full">
      <div className="container mx-auto px-5">
        <nav className="flex justify-between items-center">
          <div
            onClick={() => router.push("/")}
            className={`flex items-center gap-3 ${getNavStyle()} text-3xl font-bold cursor-pointer transition-colors`}
          >
            <div 
              className="w-7 h-7 bg-gradient-to-br from-blue-400 to-yellow-500 transition-all duration-300"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              }}
            />
            webee
          </div>
          {/* 데스크톱 네비게이션 */}
          <ul className="hidden md:flex gap-8 cursor-pointer items-center">
            <li>
              <div onClick={() => router.push("/search")} className={`${getNavStyle()} font-medium transition-colors`}>
                업체 찾기
              </div>
            </li>
            <li>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <div className={`${getNavStyle()} font-medium transition-colors`}>수정벌 솔루션</div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 rounded-md cursor-pointer" 
                    onClick={() => router.push("/diagnosis")}
                  >
                    질병진단
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 rounded-md cursor-pointer" 
                    onClick={() => router.push("/recommend")}
                  >
                    수정벌추천
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 rounded-md cursor-pointer" 
                    onClick={() => router.push("/pesticide")}
                  >
                    맞춤농약찾기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <div onClick={() => router.push("/news")} className={`${getNavStyle()} font-medium transition-colors`}>
                수정벌 뉴스
              </div>
            </li>
            {userName && (
              <li>
                <div
                  onClick={() => router.push("/mypage")}
                  className={`${getNavStyle()} font-medium transition-colors`}
                >
                  마이페이지
                </div>
              </li>
            )}
            <li className={`${getNavStyle()} font-medium transition-colors`}>
              <Logout />
            </li>
          </ul>

          {/* 모바일 버거 메뉴 버튼 */}
          <button 
            className={`md:hidden ${getNavStyle()} p-2`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200/50 z-10">
            <div className="container mx-auto px-5 py-4">
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => handleMobileMenuClick("/search")} 
                    className="w-full text-left text-gray-800 hover:text-blue-600 font-medium transition-colors py-2"
                    aria-label="업체 찾기 페이지로 이동"
                    type="button"
                  >
                    업체 찾기
                  </button>
                </li>
                <li>
                  <div className="text-gray-800 font-medium py-2">수정벌 솔루션</div>
                  <ul className="ml-4 space-y-2 mt-2">
                    <li>
                      <button 
                        onClick={() => handleMobileMenuClick("/diagnosis")} 
                        className="w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                        aria-label="질병진단 페이지로 이동"
                        type="button"
                      >
                        질병진단
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleMobileMenuClick("/recommend")} 
                        className="w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                        aria-label="수정벌추천 페이지로 이동"
                        type="button"
                      >
                        수정벌추천
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleMobileMenuClick("/pesticide")} 
                        className="w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                        aria-label="맞춤농약찾기 페이지로 이동"
                        type="button"
                      >
                        맞춤농약찾기
                      </button>
                    </li>
                  </ul>
                </li>
                <li>
                  <button 
                    onClick={() => handleMobileMenuClick("/news")} 
                    className="w-full text-left text-gray-800 hover:text-blue-600 font-medium transition-colors py-2"
                    aria-label="수정벌 뉴스 페이지로 이동"
                    type="button"
                  >
                    수정벌 뉴스
                  </button>
                </li>
                {userName && (
                  <li>
                    <button 
                      onClick={() => handleMobileMenuClick("/mypage")} 
                      className="w-full text-left text-gray-800 hover:text-blue-600 font-medium transition-colors py-2"
                      aria-label="마이페이지로 이동"
                      type="button"
                    >
                      마이페이지
                    </button>
                  </li>
                )}
                <li className="pt-2 border-t border-gray-200">
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <Logout />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}