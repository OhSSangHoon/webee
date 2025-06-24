import axios from "axios";
import { reissue, signOut } from "./api";

const api = axios.create({
  baseURL: `https://api.webee.sbs/api/v1/`,
  withCredentials: true, // 쿠키에 담긴 RT 자동 포함. 쿠키 기반 RT 사용 시 필요
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터: accessToken이 비정상(undefined/null/빈 문자열)이면 삭제
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || accessToken === "undefined") {
      localStorage.removeItem("accessToken"); // 불필요한 토큰 제거
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// ✅ 응답 인터셉터: 401 발생 시 RT로 AT 재발급, 실패 시 로그아웃
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 && !originalRequest._retry) {
      console.log("리트라이");
      try {
        const { accessToken } = await reissue(); // RT로 AT 재발급
        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (error) {
        console.error("토큰 재발급 실패", error);

        const hasRefreshToken =
          typeof window !== "undefined" &&
          document.cookie.includes("refreshToken=");

        if (!hasRefreshToken) {
          console.warn("refreshToken 쿠키 없음 - 로그아웃 처리");
          localStorage.clear();
          window.location.href = "/";
        } else {
          signOut?.();
        }

        return Promise.reject(error);
      }
    }

    console.log("임시방편-rt 재발급 안함. ");
    localStorage.clear();
    window.location.href = "/";
    return Promise.reject(error);
  }
);

export default api;
