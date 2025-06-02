"use client";

import { useEffect, useState } from "react";
import { Crop } from "@/shared/types/crop";

import {
  getCropInfo,
  getCropInfoById,
  updateCropInfo,
  deleteCropInfo,
} from "@/features/crops/api/cropApi";

export default function Crops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Crop>>({});
  const [error, setError] = useState<string | null>(null);

  const isValid = () => {
    if (
      !formData.name ||
      !formData.cultivationType ||
      !formData.cultivationArea ||
      !formData.cultivationAddress ||
      !formData.plantingDate
    ) {
      setError("모든 필수 항목을 입력해주세요.");
      return false;
    }
    setError(null);
    return true;
  }; // 필수 항목 체크.

  useEffect(() => {
    (async () => {
      const data = await getCropInfo();
      setCrops(data);
    })();
  }, []); // 렌더링 시 작물 정보 조회

  useEffect(() => {
    if (selectedId !== null) {
      (async () => {
        const detail = await getCropInfoById(selectedId);
        setSelectedCrop(detail);
        console.log("상세정보", detail);

        setIsEditing(false);
      })();
    }
  }, [selectedId]); // 작물 선택 시 상세정보 조회

  const handleDelete = async () => {
    if (selectedId !== null) {
      await deleteCropInfo(selectedId);
      setCrops((prev) => prev.filter((c) => c.id !== selectedId));
      closeModal();
    }
  }; // 작물 삭제 로직

  const handleUpdate = async () => {
    if (!isValid()) return;

    if (selectedId !== null) {
      await updateCropInfo(selectedId, formData);
      const updatedList = await getCropInfo();
      setCrops(updatedList);
      setSelectedCrop(await getCropInfoById(selectedId));
      setIsEditing(false);
    } // 작물 수정 로직
  };
  const closeModal = () => {
    setSelectedId(null);
    setSelectedCrop(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (selectedCrop) {
      setFormData({ ...selectedCrop }); // 모든 인풋 필드에 초기값 주입
    }
  }, [selectedCrop]); // 상세정보 조회 후 인풋 필드에 초기값 주입

  return (
    <div className="max-w-150  p-4 border rounded-md shadow-lg">
      <h1 className="text-2xl font-bold mb-4">수정벌 리스트</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <li
            key={crop.id}
            onClick={() => setSelectedId(crop.id)}
            className="cursor-pointer border rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{crop.name}</h2>
            <p className="text-sm text-gray-600">{crop.description}</p>
          </li>
        ))}
      </ul>

      {/* 상세 모달 */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500"
            >
              ✕
            </button>
            {/* 모달 내용: 수정일 경우와 아닐 경우 */}
            {isEditing ? (
              <>
                <h2 className="text-xl font-semibold mb-4">작물 정보 수정</h2>

                <label className="block mb-1 font-medium">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="작물 이름"
                  className="border w-full p-2 mb-2"
                />

                <label className="block mb-1 font-medium">품종</label>
                <input
                  type="text"
                  value={formData.variety || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, variety: e.target.value })
                  }
                  placeholder="품종 (선택)"
                  className="border w-full p-2 mb-2"
                />

                {/* <label className="block mb-1 font-medium">
                  설명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="작물 설명"
                  className="border w-full p-2 mb-2"
                /> */}

                <label className="block mb-1 font-medium">
                  재배 유형 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.cultivationType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cultivationType: e.target.value,
                    })
                  }
                  className="border w-full p-2 mb-2"
                >
                  <option value="">선택</option>
                  <option value="CONTROLLED">비닐하우스</option>
                  <option value="OPEN_FIELD">노지재배</option>
                </select>

                <label className="block mb-1 font-medium">
                  재배 면적 (㎡) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.cultivationArea || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cultivationArea: Number(e.target.value),
                    })
                  }
                  placeholder="면적"
                  className="border w-full p-2 mb-2"
                />

                <label className="block mb-1 font-medium">
                  재배 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cultivationAddress || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cultivationAddress: e.target.value,
                    })
                  }
                  placeholder="주소"
                  className="border w-full p-2 mb-2"
                />

                <label className="block mb-1 font-medium">
                  식재일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plantingDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, plantingDate: e.target.value })
                  }
                  className="border w-full p-2 mb-2"
                />

                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
                >
                  저장
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">
                  {selectedCrop.name}
                </h2>
                <p>품종: {selectedCrop.variety}</p>
                <p>유형: {selectedCrop.cultivationType}</p>
                <p>면적: {selectedCrop.cultivationArea} ㎡</p>
                <p>주소: {selectedCrop.cultivationAddress}</p>
                <p>식재일: {selectedCrop.plantingDate}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-400 px-4 py-2 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}