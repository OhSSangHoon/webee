"use client";

import { useState } from "react";
import AiDiagnosisUI from "./AiDiagnosisUi";
import AiDoctorUi from "./AiDoctorUi";
import api from "@/shared/auth/lib";

export default function DiagnosisWrapper() {
  const [imageFile, setImageFile] = useState<File | null>(null); // step 1. AiDiagnosis 사진
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null); // step1. AiDiagnosis 결과
  const [form, setForm] = useState({
    disease: "",
    cultivationType: "OPEN_FIELD", //기본값: 노지
    cropName: "",
    cultivationAddress: "",
    details: "",
  }); // step 2. AiDoctor에 필요한 정보

  const [aiDoctorResult, setAiDoctorResult] = useState<{
    situationAnalysis: string[];
    solutions: string[];
  } | null>(null); // step 2. AiDoctor 결과 솔루션

  const [saveResult, setSaveResult] = useState("");

  const handleUpload = async () => {
    if (!imageFile || !diagnosisResult || !aiDoctorResult) {
      alert("진단 정보가 부족합니다.");
      console.log(
        "imageFile:",
        imageFile,
        " diagnosisResult:",
        diagnosisResult,
        "aiDoctorResult:",
        aiDoctorResult
      );
      return;
    }

    const jsonData = {
      disease: diagnosisResult.name,
      confidence: parseFloat(diagnosisResult.confidence), //Number() 보다 나음.
      cropName: form.cropName,
      cultivationType: form.cultivationType,
      cultivationAddress: form.cultivationAddress,
      details: form.details,
      situationAnalysis: aiDoctorResult.situationAnalysis.join("\n"),
      solutions: aiDoctorResult.solutions.join("\n"),
    };

    const formData = new FormData();
    formData.append("beeImage", imageFile);
    formData.append("request", new Blob([JSON.stringify(jsonData)]));

    try {
      const res = await api.post("/bee/diagnosis/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // api 기본 헤더가 json으로 고정되있음 주의
        },
      });

      setSaveResult("저장 완료! 마이페이지에서 확인하세요!");
      console.log(res.data);
    } catch (error) {
      setSaveResult("저장에 실패하였습니다. 다시 시도해보세요. ");
      console.error(error);
    }
  };

  return (
    <div className="space-y-10">
      <AiDiagnosisUI
        setImageFile={setImageFile}
        setResult={setDiagnosisResult}
        result={diagnosisResult}
      />
      <AiDoctorUi
        form={form}
        setForm={setForm}
        setResult={setAiDoctorResult}
        result={aiDoctorResult}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        진단 결과 최종 저장
      </button>
      <div>{saveResult}</div>
    </div>
  );
}
