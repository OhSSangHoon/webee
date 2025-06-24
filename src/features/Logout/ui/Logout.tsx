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
    console.log(document.cookie);
  };

  return (
    <div
      className=""
      onClick={handleClick}
    >
      {userName ? "로그아웃" : "로그인"}
    </div>
  );
}
