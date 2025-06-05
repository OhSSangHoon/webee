import axios from "axios";
import { reissue, signOut } from "./api";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`,
  withCredentials: true, // 쿠키에 담긴 RT 자동 포함. 쿠키 기반 RT 사용 시 필요
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios 요청 인터셉터 (AT header에 추가 )
api.interceptors.request.use((config) => {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Axios 응답 인터셉터 (AT 만료 401 에러시, RT로 AT 재발급)
api.interceptors.response.use(
  (response) => response, // 성공이면 그대로 통과
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await reissue(); // RT로 AT 재발급
        localStorage.setItem("accessToken", accessToken);

        // 새 토큰으로 헤더 다시 설정해서 재요청
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest); // 실패했던 요청 다시 시도
      } catch (error) {
        console.error("토큰 재발급 실패", error);
        signOut(); // 재발급 실패 시 로그아웃 처리
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
