"use client";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "@/features";
import { useUserStore } from "@/shared/auth/useUserStore";


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userName } = useUserStore();
  
  const isWhiteNavPage = pathname === "/" || pathname === "/news" || pathname === "/pesticide";

  const getNavStyle = () => {
    return isWhiteNavPage ? "text-white hover:text-yellow-400" : "text-gray-800 hover:text-blue-600";
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
                꿀벌 뉴스
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
        </nav>
      </div>
    </header>
  );
}