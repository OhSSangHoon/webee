import api from "./lib";
import { SignInRequest, SignUpRequest } from "@/shared/types/auth";
import { useUserStore } from "./useUserStore";

export async function signUp(payload: SignUpRequest) {
  const response = await api.post("/auth/sign-up", payload);
  return response.data;
}

export async function signIn({ username, password }: SignInRequest) {
  const response = await api.post("/auth/sign-in", { username, password });

  // 헤더에서 Authorization 추출
  const authorization = response.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    const accessToken = authorization.split(" ")[1];
    localStorage.setItem("accessToken", accessToken);
    // zustand에 로그인 상태 저장
  }
  const { name } = response.data.data;
  const login = useUserStore.getState().login;
  login(username, name);

  return response.data;
}

export async function signOut() {
  const response = await api.post("/auth/sign-out");
  // 클라이언트 상태 초기화
  localStorage.removeItem("accessToken");
  document.cookie = "refreshToken=; path=/; max-age=0;";
  await useUserStore.getState().logout();
  return response.data;
}

export async function reissue() {
  const response = await api.post("/auth/reissue");
  return response.data;
}
