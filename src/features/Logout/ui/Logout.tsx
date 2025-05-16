"use client";

import { signOut } from "@/shared/auth/api";
import { useUserStore } from "@/shared/auth/useUserStore";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { userName } = useUserStore();
  const router = useRouter();

  const handleClick = () => {
    if (userName) {
      signOut();
    } else {
      router.push("/signIn");
    }
  };

  return (
    <div
      className="text-xs border border-gray-300 border-1.5 rounded-4xl px-4 py-1 cursor-pointer"
      onClick={handleClick}
    >
      {userName ? "로그아웃" : "로그인"}
    </div>
  );
}
