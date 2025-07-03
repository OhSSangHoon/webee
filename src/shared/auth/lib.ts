import axios from "axios";
import { reissue, signOut } from "./api";
import { safeLocalStorage } from "@/shared/utils/localStorage";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios 요청 인터셉터 (AT header에 추가)
api.interceptors.request.use((config) => {
  const accessToken = safeLocalStorage.getItem("accessToken");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Axios 응답 인터셉터 (AT 만료 401 에러시, RT로 AT 재발급)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await reissue();
        safeLocalStorage.setItem("accessToken", accessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (error) {
        console.error("토큰 재발급 실패", error);
        signOut();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;