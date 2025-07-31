"use client";

import { useState, useCallback, useMemo } from "react";
import AiDiagnosisUI from "./AiDiagnosis";
import AiDoctorUi from "./AiDoctor";
import {
  useSaveDiagnosis,
  SaveDiagnosisForm,
  AiDoctorResult,
} from "../model/useSaveDiagnosis";
import { DiagnosisResult } from "@/shared/types/diagnosis";

export default function DiagnosisWrapper() {
  const [imageFile, setImageFile] = useState<File | null>(null); // step 1. AiDiagnosis 사진
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null); // step1. AiDiagnosis 결과
  const [form, setForm] = useState<SaveDiagnosisForm>({
    cultivationType: "OPEN_FIELD",
    cropName: "",
    cultivationAddress: "",
    details: "",
  }); // step 2. AiDoctor에 필요한 정보

  const [aiDoctorResult, setAiDoctorResult] = useState<AiDoctorResult | null>(
    null
  ); // step 2. AiDoctor 결과 솔루션

  const { save, saveResult, loading } = useSaveDiagnosis();

  const canSubmit = useMemo(
    () =>
      !!imageFile &&
      !!diagnosisResult &&
      !!aiDoctorResult &&
      form.cropName.trim() !== "",
    [imageFile, diagnosisResult, aiDoctorResult, form.cropName]
  );

  const handleUpload = useCallback(async () => {
    if (!canSubmit) {
      alert("필수 진단 정보가 모두 채워져야 합니다.");
      return;
    }
    await save({ imageFile, diagnosisResult, form, aiDoctorResult });
  }, [canSubmit, save, imageFile, diagnosisResult, form, aiDoctorResult]);

  const derivedDisease = diagnosisResult?.name || "";

  return (
    <div className="space-y-10">
      <AiDiagnosisUI
        setImageFile={setImageFile}
        setResult={setDiagnosisResult}
        result={diagnosisResult}
      />
      <AiDoctorUi
        form={{ ...form, disease: derivedDisease }}
        setForm={setForm as React.Dispatch<React.SetStateAction<SaveDiagnosisForm & { disease: string }>>}
        setResult={setAiDoctorResult}
        result={aiDoctorResult}
      />
      <button
        onClick={handleUpload}
        disabled={!canSubmit || loading}
        className={`px-6 py-3 rounded ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white disabled:opacity-50`}
      >
        {loading ? "저장 중..." : "진단 결과 최종 저장"}
      </button>
      <div>{saveResult}</div>
    </div>
  );
}
