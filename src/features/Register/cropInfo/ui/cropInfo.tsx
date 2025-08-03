"use client";

import { useState } from "react";
import { useCropInfo } from "../model/useCropInfo";
import { CultivationMethod, CropFormData } from "@/shared/types/crop";
import Crops from "@/features/crops/ui/cropsUI";
import { Crop } from "@/shared/types/crop";

export default function CropInfo() {
  const { submitCropInfo, loading, error } = useCropInfo();
  const [form, setForm] = useState({
    crop: "",
    variety: "",
    method: "" as CultivationMethod,
    location: "",
    area: "",
    plantingDate: "",
  });

  const handleCropSelect = (crop: Crop) => {
    setForm({
      crop: crop.name,
      variety: crop.variety || "",
      method: "" as CultivationMethod,
      location: crop.cultivationAddress || "",
      area: crop.cultivationArea?.toString() || "",
      plantingDate: crop.plantingDate || "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await submitCropInfo(form as CropFormData);
    if (isSuccess) {
      setForm({
        crop: "",
        variety: "",
        method: "" as CultivationMethod,
        location: "",
        area: "",
        plantingDate: "",
      });
    }
  };
  return (
    <form
      className="space-y-6 max-w-[1000px] w-full  text-black flex flex-col justify-center rounded-2xl items-start shadow-lg"
      onSubmit={handleSubmit}
    >
      {/* 제목 및 설명 */}
      <div className="bg-[#EEF2FF] w-full h-[60px] px-4 py-3 rounded-t-2xl">
        <div className="font-semibold text-[16px]">
          재배작물 정보 등록 (선택)
        </div>
        <div className="text-gray-500 text-[12px]">
          양봉업체 정보를 등록하면 상품 등록 기능을 이용할 수 있습니다.
        </div>
      </div>

      {/* 노란 안내 박스 */}
      <div className="w-full px-5">
        <div className="w-full bg-amber-100 rounded-sm text-amber-950 text-[12px] px-5 py-2">
          작물 정보를 등록하시면 맞춤형 수정벌 추천, 투입일 계산 등 여러가지
          기능을 이용하실 수 있습니다. <br /> 여러 작물을 재배하시는 경우 모두
          등록해주세요.
        </div>

        {/* Section */}
        <section className="mt-6 w-full">
          <h2 className="text-lg font-semibold mb-4">새 작물 추가</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* 재배 작물 */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                재배 작물 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="crop"
                value={form.crop}
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
                name="method"
                value={form.method}
                onChange={handleChange}
                className="custom-Input"
                required
              >
                <option value="">선택해주세요</option>
                <option value="노지">노지(기본)</option>
                <option value="비닐하우스">비닐하우스</option>
              </select>
            </div>

            {/* 재배 지역 */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                재배 지역 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
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
                name="area"
                value={form.area}
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
          </div>
        </section>
        {/* 등록 버튼 */}

        <div className="flex flex-col justify-end items-end my-5 ">
          <button
            type="submit"
            className="bg-blue-500 text-white px-15 py-2 rounded "
            disabled={loading}
          >
            {loading ? "등록 중..." : "재배 작물 추가"}
          </button>
          {error && <div className="text-red-500 text-sm ">{error}</div>}
        </div>
      </div>
    </form>
  );
}
