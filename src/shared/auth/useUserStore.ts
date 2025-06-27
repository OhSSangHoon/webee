import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userName: string | null;
  realName: string | null;
  isLoggedIn: boolean;
  login: (username: string, realName: string) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      realName: null,
      isLoggedIn: false,
      login: (userName, realName) =>
        set({ userName, realName, isLoggedIn: true }),
      logout: async () => {
        set({ userName: null, realName: null, isLoggedIn: false }); // zustand 상태 초기화
      },
    }),
    {
      name: "userStorage", // zustand 상태를 localStorage에 저장
      skipHydration: true, // 클라이언트에서만 저장
    }
  )
);

export const hydrateUserStore = () => {
  if (typeof window !== "undefined") {
    useUserStore.persist.rehydrate();
  }
};
