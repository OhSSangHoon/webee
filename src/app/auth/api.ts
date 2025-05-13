import axios from "axios";
import { SignInRequest, SignUpRequest } from "@/types/auth";

const authApi = axios.create({
  baseURL: "https://api.webee.sbs/api/v1/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 기반 리프레시 토큰 사용 시 필요
});

// 회원가입
export async function signUp({ username, password, name }: SignUpRequest) {
  const response = await authApi.post("/sign-up", {
    username,
    password,
    name,
  });
  return response.data;
}

// 로그인
export async function signIn({ username, password }: SignInRequest) {
  const response = await authApi.post("/sign-in", { username, password });

  localStorage.setItem("realName", response.data.data.name);
  // 헤더에서 Authorization 추출
  const authorization = response.headers.authorization;

  if (authorization?.startsWith("Bearer ")) {
    const refreshToken = authorization.split(" ")[1];
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("username", username);

    // 요청 시 기본 Authorization 헤더로 사용되도록 설정
    axios.defaults.headers.common["Authorization"] = `Bearer ${refreshToken}`;
  } else {
    console.log("Authorization 헤더가 없습니다.");
  }

  console.log("로그인 성공");
  return response.data;
}

// 4) 로그아웃

export async function signOut() {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await authApi.post("/sign-out", { refreshToken });
  return response.data;
}

// 5) 토큰 재발급 (reissue)
export async function reissue() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await authApi.post("/reissue", { refreshToken });

    console.log("[reissue] 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[reissue] 실패:", error);
    throw error;
  }
}

// 6) Axios 응답 인터셉터 설정 (reissue 자동 처리)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        const reissueData = await reissue();
        const newAccessToken = reissueData.data;

        localStorage.setItem("accessToken", newAccessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalReq.headers["Authorization"] = `Bearer ${newAccessToken}`;

        console.log("[Interceptor] 토큰 재발급 성공, 원래 요청 재시도");
        return axios(originalReq);
      } catch (refreshError) {
        console.error("[Interceptor] 토큰 재발급 실패:", refreshError);
        await signOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
