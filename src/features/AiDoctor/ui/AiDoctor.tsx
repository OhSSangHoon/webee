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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    <div className=" flex flex-col justify-start items-stretch w-full h-full gap-4 text-[#333333]">
      <header className="font-semibold flex flex-row items-end space-x-2 text-[20px]">
        <div className="text-blue-500 ">Step 2</div> AI 꿀벌 닥터
        <div className="text-blue-500 text-[13px] mb-1 mx-2 font-medium ">
          꿀벌 이미지 질병 판단 결과와 사용자 농지 정보를 바탕으로 AI가 맞춤형
          대처 방안을 응답합니다.
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6  rounded-lg border-2 border-[#ececec] p-8"
      >
        {/* 질병 선택 */}
        <div className="flex flex-col">
          <label htmlFor="disease" className="text-[#4B5563] font-medium mb-1">
            질병 선택 <span className="text-red-500 ">*</span>
          </label>
          <select
            id="disease"
            name="disease"
            value={form.disease}
            onChange={handleChange}
            required
            className="w-full border border-[#ececec] p-2 rounded-md appearance-none placeholder-[#d1d1d1]"
          >
            <option value="" disabled hidden className="text-[#d1d1d1]">
              질병 선택
            </option>
            <option value="성충 날개불구바이러스감염증">
              성충 날개불구바이러스감염증
            </option>
            <option value="성충 응애">성충 응애</option>
            <option value="유충 부저병">유충 부저병</option>
            <option value="유충 석고병">유충 석고병</option>
          </select>
        </div>

        {/* 재배 유형(농지환경) */}
        <div className="flex flex-col">
          <label
            htmlFor="cultivationType"
            className="text-[#4B5563] font-medium mb-1"
          >
            농지환경 <span className="text-red-500">*</span>
          </label>
          <select
            id="cultivationType"
            name="cultivationType"
            value={form.cultivationType}
            onChange={handleChange}
            required
            className="w-full border border-[#ececec] p-2 rounded-md appearance-none placeholder-[#d1d1d1]"
          >
            <option value="" disabled hidden className="text-[#d1d1d1]">
              재배 유형 선택
            </option>
            <option value="CONTROLLED">시설</option>
            <option value="OPEN_FIELD">노지(기본)</option>
          </select>
        </div>

        {/* 재배작물 */}
        <div className="flex flex-col">
          <label htmlFor="cropName" className="text-[#4B5563] font-medium mb-1">
            재배작물 <span className="text-red-500">*</span>
          </label>
          <input
            id="cropName"
            name="cropName"
            placeholder="블루베리"
            value={form.cropName}
            onChange={handleChange}
            required
            className="w-full border border-[#ececec] p-2 rounded-md placeholder-[#d1d1d1]"
          />
        </div>

        {/* 농지 위치 */}
        <div className="flex flex-col">
          <label
            htmlFor="cultivationAddress"
            className="text-[#4B5563]  font-medium mb-1"
          >
            농지 위치 <span className="text-red-500">*</span>
          </label>
          <input
            id="cultivationAddress"
            name="cultivationAddress"
            placeholder="경산북도 경산시"
            value={form.cultivationAddress}
            onChange={handleChange}
            required
            className="w-full border border-[#ececec] p-2 rounded-md placeholder-[#d1d1d1]"
          />
        </div>

        {/* 추가 정보 */}
        <div className="flex flex-col">
          <label htmlFor="details" className="text-[#4B5563]  font-medium mb-1">
            추가 정보 <span className="text-red-500 ">*</span>
          </label>
          <textarea
            id="details"
            name="details"
            placeholder="추가로 알려주실 정보가 있다면 작성해 주세요. (최근 특이사항,  주변 환경 등) 없다면 '없음' 을 적어주세요"
            value={form.details}
            onChange={handleChange}
            required
            className="w-full min-h-[6rem] border border-[#ececec] p-2 rounded-md placeholder-[#d1d1d1] "
          />
        </div>

        <div className="flex flex-row gap-4">
          <Crops onSelect={handleCropSelect} />
          <button
            type="submit"
            className={`blue-button2 ${loading ? "loading" : ""}`}
          >
            {loading ? "요청 중..." : "솔루션 요청"}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-[#EEF2FF] p-8 rounded-lg  space-y-10 border border-gray-200 overflow-auto">
          <div>
            <h2 className="text-xl  font-medium mb-4 flex items-center gap-2">
              상황 분석
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              {result.situationAnalysis.map((item, idx) => (
                <li key={idx} className="text-base leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-blue-700 mb-4 flex items-center gap-2">
              솔루션 제안
            </h2>
            <div className="flex flex-col gap-4 ">
              {result.solutions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border border-white text-blue-900  p-4 hover:shadow-xl transition-shadow duration-200"
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
      <div className=" rounded-lg bg-[#FFFBEB] text-[#92400E] p-5 ">
        ⚠️ 진단 결과는 인공지능이 제공한 참고용 방안입니다. 심각한 질병의 경우
        전문가와 상담하는 것을 권장합니다.
      </div>
    </div>
  );
}
