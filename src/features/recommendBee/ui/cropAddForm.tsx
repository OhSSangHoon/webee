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
    reset(
      {
        cultivationType: crop.cultivationType || "OPEN_FIELD",
        name: crop.name,
        variety: crop.variety || "",
        cultivationAddress: crop.cultivationAddress || "",
        cultivationArea: crop.cultivationArea?.toString() || "",
        plantingDate: crop.plantingDate || "",
      },
      {
        keepDefaultValues: false,
        keepErrors: false, // 에러 clear
      }
    );
  };
  return (
    <form
      className=" flex flex-col justify-start items-stretch w-full text-gray-900 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <header className=" items-start">
        <h1 className="title-large"> 어떤 수정벌을 찾고 계신가요?</h1>
        <h2 className="title-sub">
          농작물 정보를 알려주시면 <br /> 공공데이터 기반으로 최적의 수정벌을
          추천해드려요
        </h2>
      </header>

      <Crops onSelect={handleCropSelect} />
      <div>
        <label className="input-label">
          재배 작물 <span className="text-red-500">(기본)</span>
        </label>
        <input
          type="text"
          {...register("name")}
          className="input-default"
          placeholder="예: 딸기, 블루베리 등"
        />
        {errors.name && <p className="input-error">{errors.name.message}</p>}
      </div>
      {/* 품종 */}
      <div>
        <label className="input-label">품종</label>
        <input
          type="text"
          {...register("variety")}
          className="input-default"
          placeholder="예: 설향, 한라봉 등"
        />
        {errors.variety && (
          <p className="input-error">{errors.variety.message}</p>
        )}
      </div>
      {/* 재배 방식 */}
      <div>
        <label className="input-label">
          재배 방식 <span className="text-red-500">(기본)</span>
        </label>
        <select {...register("cultivationType")} className="field-default">
          <option value="">선택해주세요</option>
          <option value="OPEN_FIELD">노지(기본)</option>
          <option value="CONTROLLED">비닐하우스</option>
        </select>
        {errors.cultivationType && (
          <p className="input-error">{errors.cultivationType.message}</p>
        )}
      </div>
      {/* 재배 지역 */}
      <div>
        <label className="input-label">
          재배 지역 <span className="text-red-500">(기본)</span>
        </label>
        <input
          type="text"
          {...register("cultivationAddress")}
          className="input-default"
          placeholder="경상북도 경산시 (정확한 주소를 입력해 주세요)"
        />
        {errors.cultivationAddress && (
          <p className="input-error">{errors.cultivationAddress.message}</p>
        )}
      </div>
      {/* 재배 면적 */}
      <div>
        <label className="input-label">
          재배 면적 (m²) <span className="text-red-500">(기본)</span>
        </label>
        <input
          type="text"
          {...register("cultivationArea")}
          className="input-default"
          placeholder="예: 300"
        />
        {errors.cultivationArea && (
          <p className="input-error">{errors.cultivationArea.message}</p>
        )}
      </div>
      {/* 정식일 (파종일) */}
      <div>
        <label className="input-label">
          정식일/파종일 <span className="text-red-500">(기본)</span>
        </label>
        <input
          type="date"
          {...register("plantingDate")}
          className="input-default"
        />
        {errors.plantingDate && (
          <p className="input-error">{errors.plantingDate.message}</p>
        )}
      </div>

      <button type="submit" className="button-yellow" disabled={loading}>
        {loading ? "분석 중..." : "추천 요청"}
      </button>
      {error && <div className="input-error">{error}</div>}
    </form>
  );
}
