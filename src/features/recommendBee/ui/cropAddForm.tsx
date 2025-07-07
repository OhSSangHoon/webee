"use client";

import { useState, useEffect } from "react";
import { useRecommendBee } from "../model/useRecommendation";
import Crops from "@/features/crops/ui/CropsUI";
import { Crop } from "@/shared/types/crop";

export default function CropInfo() {
  const { submitCropInfo, loading, error, isSuccess } = useRecommendBee();

  const [form, setForm] = useState({
    name: "",
    variety: "",
    cultivationType: "OPEN_FILED",
    cultivationAddress: "",
    cultivationArea: "",
    plantingDate: "",
  });

  useEffect(() => {
    if (isSuccess) {
      setForm({
        name: "",
        variety: "",
        cultivationType: "OPEN_FILED",
        cultivationAddress: "",
        cultivationArea: "",
        plantingDate: "",
      });
    }
  }, [isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCropInfo(form);
  };

  const handleCropSelect = (crop: Crop) => {
    setForm({
      cultivationType: crop.cultivationType || "",
      name: crop.name,
      variety: crop.variety || "",
      cultivationAddress: crop.cultivationAddress || "",
      cultivationArea: crop.cultivationArea?.toString() || "",
      plantingDate: crop.plantingDate || "",
    });
  };

  return (
    <form
      className=" flex flex-col justify-start items-stretch w-full gap-4 card-section"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold">
        🥬 새 작물 추가{" "}
        <span className="text-sm text-red-400">
          <span className="text-red-500">*</span> 별이 붙어있는 항목은
          필수입력이에요.{" "}
        </span>
      </h2>
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 작물 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="custom-Input"
          placeholder="예: 딸기, 블루베리 등"
          required
        />
      </div>
      {/* 품종 */}
      <div>
        <label className="block mb-1 text-sm font-medium">품종</label>
        <input
          type="text"
          name="variety"
          value={form.variety}
          onChange={handleChange}
          className="custom-Input"
          placeholder="예: 설향, 한라봉 등"
        />
      </div>
      {/* 재배 방식 */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 방식 <span className="text-red-500">*</span>
        </label>
        <select
          name="cultivationType"
          value={form.cultivationType}
          onChange={handleChange}
          className="custom-Input"
          required
        >
          <option value="">선택해주세요</option>
          <option value="OPEN_FIELD">노지(기본)</option>
          <option value="CONTROLLED">비닐하우스</option>
        </select>
      </div>
      {/* 재배 지역 */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 지역{" "}
          <span className="text-red-500">* 정확한 주소를 입력해주세요!</span>
        </label>
        <input
          type="text"
          name="cultivationAddress"
          value={form.cultivationAddress}
          onChange={handleChange}
          className="custom-Input"
          placeholder="예: 경상북도 경산시"
          required
        />
      </div>
      {/* 재배 면적 */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          재배 면적 (m²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="cultivationArea"
          value={form.cultivationArea}
          onChange={handleChange}
          className="custom-Input"
          placeholder="예: 300"
          required
        />
      </div>
      {/* 정식일 (파종일) */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          정식 (또는 파종)일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="plantingDate"
          value={form.plantingDate}
          onChange={handleChange}
          className="custom-Input"
          required
        />
      </div>
      <div className="flex flex-row w-full gap-2">
        <Crops onSelect={handleCropSelect} />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white  rounded m-0 hover:bg-blue-600 transition duration-200 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "분석 중..." : "대처 방안 요청"}
        </button>
        {error && <div className="text-red-500 text-sm pb-5">{error}</div>}
      </div>
    </form>
  );
}
