"use client";
import api from "@/shared/auth/lib";
import { Crops } from "@/features";
import { Crop } from "@/shared/types/crop";
import { useState } from "react";

type FormType = {
  disease: string;
  cultivationType: string;
  cropName: string;
  cultivationAddress: string;
  details: string;
};

type AiDoctorResult = {
  situationAnalysis: string[];
  solutions: string[];
};

type AiDoctorUiProps = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  setResult: React.Dispatch<React.SetStateAction<AiDoctorResult | null>>;
  result: AiDoctorResult | null;
};

export default function AiDoctorUi({
  form,
  setForm,
  setResult,
  result,
}: AiDoctorUiProps) {
  const [loading, setLoading] = useState(false);

  const handleCropSelect = (crop: Crop) => {
    setForm({
      disease: "",
      cultivationType: crop.cultivationType || "",
      cropName: crop.name,
      cultivationAddress: crop.cultivationAddress || "",
      details: crop.description || "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    setLoading(true);
    try {
      const response = await api.post("/bee/diagnosis/ai", form);
      setResult(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("AI 진단 요청 실패:", error);
      alert("AI 진단 요청에 실패했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col justify-start items-stretch w-full h-full gap-4 card-section-2">
      <div>
        <h2 className="text-2xl font-bold">
          <span className="text-blue-500 text-3xl">Step 2</span> AI 꿀벌 닥터
        </h2>
        <div>
          꿀벌 이미지 질병 판단 결과와 사용자 농지 정보를 바탕으로 AI가 맞춤형
          대처 방안을 응답합니다.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select
          name="disease"
          value={form.disease}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-md"
        >
          <option value="">질병 선택</option>
          <option value="성충 날개불구바이러스감염증">
            성충 날개불구바이러스감염증
          </option>
          <option value="성충 응애">성충 응애</option>
          <option value="유충 부저병">유충 부저병</option>
          <option value="유충 석고병">유충 석고병</option>
        </select>
        <select
          name="cultivationType"
          value={form.cultivationType}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-md"
        >
          <option value="">재배 유형 선택</option>
          <option value="CONTROLLED">시설</option>
          <option value="OPEN_FIELD">노지(기본)</option>
        </select>
        <input
          name="cropName"
          placeholder="작물명"
          value={form.cropName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-md"
        />
        <input
          name="cultivationAddress"
          placeholder="재배지 주소"
          value={form.cultivationAddress}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-md"
        />
        <input
          name="details"
          placeholder="기타 사항"
          value={form.details}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-md"
        />

        <div className="flex flex-row gap-4">
          <Crops onSelect={handleCropSelect} />
          <button
            type="submit"
            className={` blue-button2 ${loading ? "loading" : ""}`}
          >
            {loading ? "요청 중..." : "AI 진단 요청"}
          </button>
        </div>
      </form>
      {result && (
        <div className="bg-gray-50 p-6 rounded-2xl shadow-lg space-y-10 border border-gray-200 overflow-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🧠 상황 분석
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              {result.situationAnalysis.map((item, idx) => (
                <li key={idx} className="text-base leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
              🛠 솔루션 제안
            </h2>
            <div className="flex flex-col gap-4 ">
              {result.solutions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300 text-blue-900 shadow-md rounded-xl p-4 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 text-xl">✅</span>
                    <p className="text-base leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className=" rounded-2xl bg-amber-200 p-5 ">
        ⚠️ 진단 결과는 인공지능이 제공한 참고용 방안입니다. 심각한 질병의 경우
        전문가와 상담하는 것을 권장합니다.
      </div>
    </div>
  );
}
