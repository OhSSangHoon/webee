import api from "@/shared/auth/lib";
import { BeeDiagnosisListResponse } from "../model/model";

/**
 * 진단 목록 조회 API
 * @returns {Promise<BeeDiagnosisListResponse>} 진단 목록 응답 모델
 */
export async function getBeeDiagnosisList(): Promise<BeeDiagnosisListResponse> {
  try {
    const response = await api.get<BeeDiagnosisListResponse>('/bee/diagnosis');
    return response.data;
  } catch (error) {
    console.error('진단 목록 조회 실패:', error);
    throw new Error('진단 목록을 불러올 수 없습니다.');
  }
}