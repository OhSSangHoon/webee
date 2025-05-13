import { useCallback } from "react";
import { signOut } from "@/app/auth/api";

export function useLogout() {
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      await signOut();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");

      console.log("로그아웃 성공");
      window.location.href = "/home";
    }
  }, []);

  return { logout };
}
