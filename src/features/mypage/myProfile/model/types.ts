/**
 * 사용자 프로필 정보 타입
 */
export type ProfileInfo = {
    realName: string;
    cropAddresses: string[];
  };
  
  /**
   * 프로필 상태 타입
   */
  export type ProfileState = {
    realName: string;
    cropAddresses: string[];
    loading: boolean;
    error: string;
    isClient: boolean;
  };
  
  /**
   * API 응답 - 작물 재배지 목록
   */
  export type CropAddressResponse = {
    code: string;
    message: string;
    data: {
      address: string[];
    };
  };
  
  /**
   * 작물 재배지 데이터
   */
  export type CropAddressData = {
    address: string[];
  };