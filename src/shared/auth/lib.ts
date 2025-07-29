import axios from "axios";
import { reissue } from "./api";
import { safeLocalStorage } from "@/shared/utils/localStorage";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const hasRefreshToken = () => {
  return (
    typeof window !== "undefined" && document.cookie.includes("refreshToken")
  );
};

// Axios 요청 인터셉터 (AT header에 추가)
api.interceptors.request.use((config) => {
  const accessToken = safeLocalStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 발생 시 RT로 AT 재발급, 실패 시 로그아웃
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // 에러가 발생한 원래 요청
    if (!originalRequest) return Promise.reject(error); // 에러 정의 X시 재요청 불가

    // 401 에러일 때만 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        // 리프레시 토큰이 없으면 로그아웃 처리
        if (!hasRefreshToken()) {
          console.warn("리프레시 토큰 없음. 로그아웃 처리");
          localStorage.clear();
          window.location.href = "/signIn";
          return Promise.reject(error); // 로그아웃 후 더 이상 진행하지 않음
        }

        // 리프레시 토큰으로 액세스 토큰 갱신
        const { accessToken } = await reissue();
        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`; // 재요청 시 갱신된 AT 사용

        return api(originalRequest); // 갱신된 토큰으로 재요청
      } catch (reissueError) {
        console.error("액세스 토큰 갱신 실패", reissueError);
        // 리프레시 토큰도 없고 갱신 실패 시 로그아웃 처리
        localStorage.clear();
        window.location.href = "/signIn"; // 로그인 페이지로 리다이렉트
        return Promise.reject(reissueError); // 에러 전달
      }
    }

    return Promise.reject(error); // 401이 아닌 다른 에러는 그대로 전달
  }
);

export default api;
