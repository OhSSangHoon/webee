"use client";

import { useState, useCallback, useMemo } from "react";
import AiDiagnosisUI from "./AiDiagnosis";
import AiDoctorUi from "./AiDoctor";
import { useSaveDiagnosis, SaveDiagnosisForm, AiDoctorResult } from "../model/useSaveDiagnosis";
import { DiagnosisResult } from "@/shared/types/diagnosis";

export default function DiagnosisWrapper() {
  const [imageFile, setImageFile] = useState<File | null>(null); // AiDiagnosis 사진
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null); // AiDiagnosis 결과
  const [form, setForm] = useState<SaveDiagnosisForm & { disease: string }>({
    disease: "",
    cultivationType: "OPEN_FIELD",
    cropName: "",
    cultivationAddress: "",
    details: "",
  }); // AiDoctor에 필요한 정보

  const [aiDoctorResult, setAiDoctorResult] = useState<AiDoctorResult | null>(
    null
  ); // AiDoctor 결과 솔루션

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

  // useMemo로 aiDoctorForm 생성 (derivedDisease 자동 반영)
  const aiDoctorForm = useMemo(() => ({
    disease: derivedDisease,
    cultivationType: form.cultivationType,
    cropName: form.cropName,
    cultivationAddress: form.cultivationAddress,
    details: form.details,
  }), [derivedDisease, form.cultivationType, form.cropName, form.cultivationAddress, form.details]);

  return (
    <div className="card-section-2 mt-20 text-[#333333] ">
      <header className="flex flex-col items-start justify-center bg-blue-50 px-6 py-6 rounded-t-lg">
        <h1 className="text-[18px] font-semibold text-gray-900">꿀벌 질병 진단</h1>
        <h2 className="text-[14px] text-gray-700">
          60만 장의 꿀벌 이미지 분석을 통해 질병 여부를 진단하고 맞춤형 대처
          방안을 받아보세요
        </h2>
      </header>
      <div className="lg:mx-8 py-10 sm:px-4 space-y-20">
        <AiDiagnosisUI
          setImageFile={setImageFile}
          setResult={setDiagnosisResult}
          result={diagnosisResult}
        />
        <AiDoctorUi
          form={aiDoctorForm}
          setForm={setForm}
          setResult={setAiDoctorResult}
          result={aiDoctorResult}
        />
        <div className="text-center">
          <button
            onClick={handleUpload}
            disabled={!canSubmit || loading}
            className={` mb-2 blue-button2 ${
              loading ? "loading" : ""
            } disabled:opacity-50`}
          >
            {loading ? "저장 중..." : "진단 결과 최종 저장"}
          </button>
          <div>{saveResult}</div>
        </div>
      </div>
    </div>
  );
}