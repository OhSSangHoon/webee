"use client";
import api from "@/shared/auth/lib";
import { Crops } from "@/features";
import { Crop } from "@/shared/types/crop";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";

type AiDoctorFormValues = {
  disease: string;
  cultivationType: string;
  cropName: string;
  cultivationAddress: string;
  details: string;
};

const schema = yup.object({
  disease: yup.string().required("질병을 선택해주세요."),
  cultivationType: yup.string().required("농지환경을 선택해주세요."),
  cropName: yup.string().required("재배작물을 입력해주세요."),
  cultivationAddress: yup.string().required("농지 위치를 입력해주세요."),
  details: yup.string().required("추가 정보를 입력해주세요."),
});

type AiDoctorResult = {
  situationAnalysis: string[];
  solutions: string[];
};

type FormType = {
  disease: string;
  cultivationType: string;
  cropName: string;
  cultivationAddress: string;
  details: string;
};

type AiDoctorUiProps = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  setResult: React.Dispatch<React.SetStateAction<AiDoctorResult | null>>;
  result: AiDoctorResult | null;
};

export default function AiDoctorUi({
  form: externalForm,
  setForm: setExternalForm,
  setResult,
  result,
}: AiDoctorUiProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<AiDoctorFormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: externalForm
  });

  // ✅ 개별 필드를 watch (무한 루프 방지)
  const disease = watch("disease");
  const cultivationType = watch("cultivationType");
  const cropName = watch("cropName");
  const cultivationAddress = watch("cultivationAddress");
  const details = watch("details");

  // ✅ 개별 필드를 의존성으로 사용
  useEffect(() => {
    setExternalForm({
      disease,
      cultivationType,
      cropName,
      cultivationAddress,
      details,
    });
  }, [disease, cultivationType, cropName, cultivationAddress, details, setExternalForm]);

  const handleCropSelect = (crop: Crop) => {
    setValue("disease", "");
    setValue("cultivationType", crop.cultivationType || "");
    setValue("cropName", crop.name);
    setValue("cultivationAddress", crop.cultivationAddress || "");
    setValue("details", crop.description || "");
  };

  const onSubmit = async (data: AiDoctorFormValues) => {
    try {
      const response = await api.post("/bee/diagnosis/ai", data);
      setResult(response.data.data);
    } catch (error) {
      console.error("AI 진단 요청 실패:", error);
      alert("AI 진단 요청에 실패했습니다.");
    }
  };

  return (
    <div className=" flex flex-col justify-start items-stretch w-full h-full gap-4 text-[#333333]">
      <header className="font-semibold flex flex-row items-end space-x-2 text-[20px]">
        <div className="text-blue-700 font-semibold">Step 2</div> AI 꿀벌 닥터
        <div className="text-blue-700 text-[13px] mb-1 mx-2 font-medium">
          꿀벌 이미지 질병 판단 결과와 사용자 농지 정보를 바탕으로 AI가 맞춤형
          대처 방안을 응답합니다.
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6  rounded-lg border-1 border-[#ececec] p-8"
      >
        {/* 질병 선택 */}
        <div className="flex flex-col">
          <label htmlFor="disease" className="text-[#4B5563] font-medium mb-1">
            질병 선택 <span className="text-red-500 ">*</span>
            <span className="text-gray-700 text-sm">
              {" "}
              (사진 진단 후 이용할 수 있습니다.)
            </span>
          </label>
          <select
            id="disease"
            {...register("disease")}
            className="w-full border border-[#ececec] p-2 rounded-md appearance-none placeholder-[#d1d1d1]"
          >
            <option value="" disabled hidden className="text-[#d1d1d1]">
              질병 선택
            </option>
            <option value="유층 응애">유충 응애</option>
            <option value="성충 응애">성충 응애</option>
            <option value="유충 부저병">유충 부저병</option>
            <option value="유충 석고병">유충 석고병</option>
            <option value="성충 날개불구바이러스감염증">
              성충 날개불구바이러스감염증
            </option>
          </select>
          {errors.disease && (
            <p className="text-red-500 text-sm mt-1">{errors.disease.message}</p>
          )}
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
            {...register("cultivationType")}
            className="w-full border border-[#ececec] p-2 rounded-md appearance-none placeholder-[#d1d1d1]"
          >
            <option value="" disabled hidden className="text-[#d1d1d1]">
              재배 유형 선택
            </option>
            <option value="CONTROLLED">시설</option>
            <option value="OPEN_FIELD">노지(기본)</option>
          </select>
          {errors.cultivationType && (
            <p className="text-red-500 text-sm mt-1">{errors.cultivationType.message}</p>
          )}
        </div>

        {/* 재배작물 */}
        <div className="flex flex-col">
          <label htmlFor="cropName" className="text-[#4B5563] font-medium mb-1">
            재배작물 <span className="text-red-500">*</span>
          </label>
          <input
            id="cropName"
            {...register("cropName")}
            placeholder="블루베리"
            className="w-full border border-[#ececec] p-2 rounded-md placeholder-[#d1d1d1]"
          />
          {errors.cropName && (
            <p className="text-red-500 text-sm mt-1">{errors.cropName.message}</p>
          )}
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
            {...register("cultivationAddress")}
            placeholder="경산북도 경산시 (정확한 주소를 입력해 주세요)"
            className="w-full border border-[#ececec] p-2 rounded-md placeholder-[#d1d1d1]"
          />
          {errors.cultivationAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.cultivationAddress.message}</p>
          )}
        </div>

        {/* 추가 정보 */}
        <div className="flex flex-col">
          <label htmlFor="details" className="text-[#4B5563]  font-medium mb-1">
            추가 정보 <span className="text-red-500 ">*</span>
          </label>
          <textarea
            id="details"
            {...register("details")}
            placeholder="추가로 알려주실 정보가 있다면 작성해 주세요. (최근 특이사항,  주변 환경 등) 없다면 '없음' 을 적어주세요"
            className="w-full min-h-[6rem] border border-[#ececec] p-2 rounded-md placeholder-[#d1d1d1] "
          />
          {errors.details && (
            <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
          )}
        </div>

        <div className="flex flex-row gap-4">
          <Crops onSelect={handleCropSelect} />
          <button
            type="submit"
            className={`blue-button2 ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "요청 중..." : "솔루션 요청"}
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