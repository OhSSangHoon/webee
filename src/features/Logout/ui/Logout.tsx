"use client";

import { useLogout } from "../model/Logout";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const { logout } = useLogout();
  const router = useRouter();

  const handleClick = () => {
    if (refreshToken) {
      logout();
    } else {
      router.push("/signIn");
    }
  };

  return (
    <div
      className="text-xs border border-gray-300 border-1.5 rounded-4xl px-4 py-1 cursor-pointer"
      onClick={handleClick}
    >
      {refreshToken ? "로그아웃" : "로그인"}
    </div>
  );
}
