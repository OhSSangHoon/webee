// features/crops/Crops.tsx
"use client";
import { useState, useEffect } from "react";
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
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setHasAccessToken(!!localStorage.getItem("accessToken"));
    }
  }, []);

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
        disabled={!hasAccessToken || undefined}
        className={`relative w-full px-4 py-2 rounded-sm border text-blue-500 ${
          isMounted && hasAccessToken
            ? "white-button"
            : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        작물 정보 가져오기
        {!hasAccessToken && (
          <p className=" absolute mt-2 text-sm text-red-500">
            로그인 시 사용 가능합니다.
          </p>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>

              <h1 className="text-base font-medium mb-4">작물 리스트</h1>
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
