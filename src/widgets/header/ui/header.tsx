"use client";

import { useRouter } from "next/navigation";
import { Logout } from "@/features";
import { useUserStore } from "@/shared/auth/useUserStore";

export default function Header() {
  const router = useRouter();
  const { userName } = useUserStore();

  return (
    <div className="w-full h-20 px-10 flex flex-row justify-around items-center bg-white text-black text-xl border-b border-gray-300 mb-20">
      <div className="text-4xl cursor-pointer" onClick={() => router.push("/")}>
        WeeBee
      </div>
      <div className="flex flex-row gap-14">
        <div className="cursor-pointer" onClick={() => router.push("/search")}>
          업체검색
        </div>
        <div
          className="cursor-pointer"
          onClick={() => router.push("/diagnosis")}
        >
          질병진단
        </div>
        <div className="cursor-pointer" onClick={() => router.push("/guide")}>
          수정벌 가이드
        </div>
        {userName && (
          <div
            className="cursor-pointer"
            onClick={() => router.push("/mypage")}
          >
            마이페이지
          </div>
        )}
        <Logout />
      </div>
    </div>
  );
}
