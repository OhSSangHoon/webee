import { useState, useEffect } from "react";
import { profileApi } from "../api/api";
import { ProfileState } from "./types";

/**
 * 사용자 프로필 정보를 관리하는 커스텀 훅
 */
export const useProfile = () => {
  const [state, setState] = useState<ProfileState>({
    realName: "",
    cropAddresses: [],
    loading: true,
    error: "",
    isClient: false,
  });

  useEffect(() => {
    setState(prev => ({ ...prev, isClient: true }));

    const fetchProfileData = async () => {
      try {
        // localStorage에서 사용자 이름 가져오기
        let realName = "";
        const storedData = localStorage.getItem("userStorage");
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            realName = parsed.state?.realName || "";
          } catch (error) {
            console.error("userStorage 파싱 오류:", error);
          }
        }

        // API에서 재배지 목록 가져오기
        const cropAddresses = await profileApi.getCropAddresses();

        setState(prev => ({
          ...prev,
          realName,
          cropAddresses,
          loading: false,
        }));
      } catch (error) {
        console.error("프로필 데이터 로딩 오류:", error);
        setState(prev => ({
          ...prev,
          error: "프로필 정보를 불러오는데 실패했습니다.",
          loading: false,
        }));
      }
    };

    fetchProfileData();
  }, []);

  return state;
};