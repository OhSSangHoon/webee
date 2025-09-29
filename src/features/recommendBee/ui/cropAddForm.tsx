"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRecommendBee } from "../model/useRecommendation";
import Crops from "@/features/crops/ui/cropsUI";
import { Crop } from "@/shared/types/crop";

type CropInfoFormValues = {
  name: string;
  variety: string;
  cultivationType: string;
  cultivationAddress: string;
  cultivationArea: string;
  plantingDate: string;
};

const schema = yup.object({
  name: yup.string().required("재배 작물을 입력해주세요."),
  variety: yup.string().default(""),
  cultivationType: yup.string().required("재배 방식을 선택해주세요."),
  cultivationAddress: yup.string().required("재배 지역을 입력해주세요."),
  cultivationArea: yup
    .string()
    .required("재배 면적을 입력해주세요.")
    .matches(/^\d+$/, "재배 면적은 숫자만 입력 가능합니다."),
  plantingDate: yup.string().required("정식일을 입력해주세요."),
});

export default function CropInfo() {
  const { submitCropInfo, loading, error, isSuccess } = useRecommendBee();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CropInfoFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      variety: "",
      cultivationType: "OPEN_FIELD",
      cultivationAddress: "",
      cultivationArea: "",
      plantingDate: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  const onSubmit = async (data: CropInfoFormValues) => {
    await submitCropInfo(data);
  };

  const handleCropSelect = (crop: Crop) => {
    setValue("cultivationType", crop.cultivationType || "");
    setValue("name", crop.name);
    setValue("variety", crop.variety || "");
    setValue("cultivationAddress", crop.cultivationAddress || "");
    setValue("cultivationArea", crop.cultivationArea?.toString() || "");
    setValue("plantingDate", crop.plantingDate || "");
  };

  return (
    <form
      className=" flex flex-col justify-start items-stretch w-full  card-section text-[#333333]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold pb-10">
        🥬 새 작물 추가
        <span className="text-sm text-red-400">
          <span className="text-red-500">*</span> 별이 붙어있는 항목은
          필수입력이에요.
        </span>
      </h2>
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 작물 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          className="custom-Input"
          placeholder="예: 딸기, 블루베리 등"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      {/* 품종 */}
      <div>
        <label className="block mb-1 text-sm font-medium">품종</label>
        <input
          type="text"
          {...register("variety")}
          className="custom-Input"
          placeholder="예: 설향, 한라봉 등"
        />
        {errors.variety && (
          <p className="text-red-500 text-sm mt-1">{errors.variety.message}</p>
        )}
      </div>
      {/* 재배 방식 */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 방식 <span className="text-red-500">*</span>
        </label>
        <select
          {...register("cultivationType")}
          className="custom-Input"
        >
          <option value="">선택해주세요</option>
          <option value="OPEN_FIELD">노지(기본)</option>
          <option value="CONTROLLED">비닐하우스</option>
        </select>
        {errors.cultivationType && (
          <p className="text-red-500 text-sm mt-1">{errors.cultivationType.message}</p>
        )}
      </div>
      {/* 재배 지역 */}
      <div>
        <label className="block mb-1 text-sm font-medium">재배 지역 <span className="text-red-500">*</span></label>
        <input
          type="text"
          {...register("cultivationAddress")}
          className="custom-Input"
          placeholder="경상북도 경산시 (정확한 주소를 입력해 주세요)"
        />
        {errors.cultivationAddress && (
          <p className="text-red-500 text-sm mt-1">{errors.cultivationAddress.message}</p>
        )}
      </div>
      {/* 재배 면적 */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 면적 (m²) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("cultivationArea")}
          className="custom-Input"
          placeholder="예: 300"
        />
        {errors.cultivationArea && (
          <p className="text-red-500 text-sm mt-1">{errors.cultivationArea.message}</p>
        )}
      </div>
      {/* 정식일 (파종일) */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          정식 (또는 파종)일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("plantingDate")}
          className="custom-Input"
        />
        {errors.plantingDate && (
          <p className="text-red-500 text-sm mt-1">{errors.plantingDate.message}</p>
        )}
      </div>
      <div className="flex flex-row w-full gap-2 pt-10">
        <Crops onSelect={handleCropSelect} />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white  rounded m-0 hover:bg-blue-600 transition duration-200 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={loading}
        >
          {loading ? "분석 중..." : "추천 요청"}
        </button>
        {error && <div className="text-red-500 text-sm pb-5">{error}</div>}
      </div>
    </form>
  );
}
