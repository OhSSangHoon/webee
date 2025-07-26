/**
 * 진단 목록 응답 모델
 * @interface BeeDiagnosisItem
 * @property {number} beeDiagnosisId - 진단 ID
 * @property {string} imageUrl - 이미지 URL
 * @property {string} diseaseType - 질병 타입
 * @property {string} situationAnalysis - 상황 분석
 * @property {string} createdAt - 생성 일시
 */
export interface BeeDiagnosisItem {
    beeDiagnosisId: number;
    imageUrl: string;
    diseaseType: string;
    situationAnalysis: string;
    createdAt: string;
  }
  
  /**
   * 진단 목록 응답 모델
   * @interface BeeDiagnosisListResponse
   * @property {string} code - 응답 코드
   * @property {string} message - 응답 메시지
   * @property {BeeDiagnosisItem[]} data - 진단 목록
   */
  export interface BeeDiagnosisListResponse {
    code: string;
    message: string;
    data: BeeDiagnosisItem[];
  }