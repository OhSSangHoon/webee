import axios from "axios";
import { reissue } from "./api";

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

// ✅ 리프레시 토큰이 있는지 확인하는 함수
const hasRefreshToken = () => {
  return (
    typeof window !== "undefined" && document.cookie.includes("refreshToken=")
  );
};

// ✅ 응답 인터셉터: 401 발생 시 RT로 AT 재발급, 실패 시 로그아웃
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
