"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Logout } from "@/features";
import { useUserStore } from "@/shared/auth/useUserStore";

export default function Header() {
  const router = useRouter();
  const { userName } = useUserStore();

  return (
    <header className="absolute top-0 z-20 pt-5 w-full">
      <div className="container mx-auto px-5">
        <nav className="flex justify-between items-center">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-gray-900 hover:text-blue-600 text-3xl font-bold cursor-pointer transition-colors"
          >
            webee
          </div>
          <ul className="hidden md:flex gap-8 cursor-pointer items-center">
            <li>
              <div onClick={() => router.push("/search")} className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                업체검색
              </div>
            </li>
            <li>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <div className="text-gray-900 hover:text-blue-600 font-medium transition-colors">AI 컨설팅</div>
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
                    맞는농약찾기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <div onClick={() => router.push("/news")} className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                꿀벌뉴스
              </div>
            </li>
            {userName && (
              <li>
                <div
                  onClick={() => router.push("/mypage")}
                  className="text-gray-900 hover:text-blue-600 font-medium transition-colors"
                >
                  마이페이지
                </div>
              </li>
            )}
            <li className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
              <Logout />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}