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
        set({ userName: null, realName: null, isLoggedIn: false });
      },
    }),
    {
      name: "userStorage",
      skipHydration: true, // SSR 안전성을 위해 추가
    }
  )
);

// 클라이언트에서만 hydrate하는 함수
export const hydrateUserStore = () => {
  if (typeof window !== 'undefined') {
    useUserStore.persist.rehydrate();
  }
};