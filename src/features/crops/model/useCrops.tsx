// features/crops/hooks/useCrops.ts
import { useEffect, useState } from "react";
import { Crop } from "@/shared/types/crop";
import {
  getCropInfo,
  getCropInfoById,
  updateCropInfo,
  deleteCropInfo,
} from "@/features/crops/api/cropApi";

export function useCrops(lazy = false) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState<Partial<Crop>>({});
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCrops = async () => {
    const data = await getCropInfo();
    setCrops(data);
  };

  useEffect(() => {
    if (!lazy) {
      fetchCrops();
    }
  }, [lazy]);

  //selectedId가 바뀌면 selectedCrop 갱신
  useEffect(() => {
    if (selectedId !== null) {
      const crop = crops.find((c) => c.id === selectedId) || null;
      setSelectedCrop(crop);
      setIsEditing(false);
    } else {
      setSelectedCrop(null);
    }
  }, [selectedId, crops]);

  //selectedCrop이 바뀌면 formData 초기화
  useEffect(() => {
    if (selectedCrop) {
      setFormData({ ...selectedCrop });
    }
  }, [selectedCrop]);

  const validate = () => {
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
  };

  const updateCrop = async () => {
    if (!validate() || selectedId === null) return;
    await updateCropInfo(selectedId, formData);
    await fetchCrops();
    setSelectedCrop(await getCropInfoById(selectedId));
    setIsEditing(false);
  };

  const deleteCrop = async () => {
    if (selectedId === null) return;
    await deleteCropInfo(selectedId);
    setCrops((prev) => prev.filter((c) => c.id !== selectedId));
    setSelectedId(null);
  };

  return {
    crops,
    selectedId,
    selectedCrop,
    formData,
    error,
    isEditing,
    setSelectedId,
    setIsEditing,
    setFormData,
    updateCrop,
    deleteCrop,
    validate,
    setError,
    fetchCrops,
  };
}
