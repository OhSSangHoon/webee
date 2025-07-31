import { useState, useCallback } from "react";
import api from "@/shared/auth/lib";
import { DiagnosisResult } from "@/shared/types/diagnosis";

export interface AiDoctorResult {
  situationAnalysis: string[];
  solutions: string[];
}

export interface SaveDiagnosisForm {
  cropName: string;
  cultivationType: string; 
  cultivationAddress: string;
  details: string;
}

export interface SaveDiagnosisOptions {
  imageFile: File | null;
  diagnosisResult: DiagnosisResult | null;
  form: SaveDiagnosisForm;
  aiDoctorResult: AiDoctorResult | null;
}

export function useSaveDiagnosis() {
  const [saveResult, setSaveResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setSaveResult("");
    setLoading(false);
  }, []);

  const save = useCallback(async (opts: SaveDiagnosisOptions) => {
    const { imageFile, diagnosisResult, form, aiDoctorResult } = opts;
    if (!imageFile || !diagnosisResult || !aiDoctorResult) {
      setSaveResult(
        "진단 정보가 부족합니다. 이미지, 결과, 또는 의사 AI 정보가 누락됨."
      );
      return { success: false, reason: "incomplete" };
    }

    setLoading(true);
    setSaveResult("");

    const jsonData = {
      disease: diagnosisResult.name,
      confidence: parseFloat(diagnosisResult.confidence),
      cropName: form.cropName,
      cultivationType: form.cultivationType,
      cultivationAddress: form.cultivationAddress,
      details: form.details,
      situationAnalysis: aiDoctorResult.situationAnalysis.join("\n"),
      solutions: aiDoctorResult.solutions.join("\n"),
    } as const;

    const formData = new FormData();
    formData.append("beeImage", imageFile);
    formData.append(
      "request",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    try {
      const res = await api.post("/bee/diagnosis/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSaveResult("저장 완료! 마이페이지에서 확인하세요!");
      return { success: true, data: res.data };
    } catch (error) {
      console.error("saveDiagnosis error:", error);
      setSaveResult("저장에 실패하였습니다. 다시 시도해보세요.");
      return { success: false, reason: "network", error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    save,
    saveResult,
    loading,
    reset,
  } as const;
}
