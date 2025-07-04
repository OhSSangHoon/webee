// features/crops/Crops.tsx
"use client";
import { useState } from "react";
import { Crop } from "@/shared/types/crop";
import { useCrops } from "../model/useCrops";
import CropModal from "./cropModal";
import CropList from "./cropList";

type Props = {
  onSelect: (crop: Crop) => void;
};

export default function Crops({ onSelect }: Props) {
  const {
    crops,
    selectedCrop,
    formData,
    isEditing,
    error,
    setSelectedId,
    setIsEditing,
    setFormData,
    updateCrop,
    deleteCrop,
    setError,
    fetchCrops,
  } = useCrops(true); //lazy

  const [isOpen, setIsOpen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const hasAccessToken = !!localStorage.getItem("accessToken");

  const openModal = () => {
    setIsOpen(true);
    if (!hasAccessToken) return; // at 없으면 막기
    if (!shouldLoad) {
      fetchCrops(); // 모달 최초 열릴 때만 API 호출
      setShouldLoad(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleSelect = () => {
    if (selectedCrop) {
      onSelect(selectedCrop);
      closeModal();
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={openModal}
        disabled={!hasAccessToken} // 중복 막기
        className={`relative w-full px-4 py-2 rounded-md border text-blue-500 ${
          hasAccessToken
            ? "border-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer"
            : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        기존 작물 정보 가져오기
        {!hasAccessToken && (
          <p className=" absolute mt-2 text-sm text-red-500">
            로그인 시 사용 가능합니다.
          </p>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white max-w-3xl w-full p-6 rounded-md shadow-lg relative">
              <button
                onClick={openModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>

              <h1 className="text-2xl font-bold mb-4">작물 리스트</h1>
              <CropList crops={crops} onSelect={setSelectedId} />

              {selectedCrop && (
                <CropModal
                  crop={selectedCrop}
                  formData={formData}
                  isEditing={isEditing}
                  onClose={closeModal}
                  onEdit={() => setIsEditing(true)}
                  onDelete={deleteCrop}
                  onSelect={handleSelect}
                  onChange={setFormData}
                  onSave={updateCrop}
                  error={error}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
