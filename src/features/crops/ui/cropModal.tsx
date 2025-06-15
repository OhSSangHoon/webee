// features/crops/components/CropModal.tsx
import { Crop } from "@/shared/types/crop";
import CropEditForm from "./cropEditForm";

type Props = {
  crop: Crop;
  formData: Partial<Crop>;
  isEditing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
  onChange: (form: Partial<Crop>) => void;
  onSave: () => void;
  error?: string | null;
};

export default function CropModal({
  crop,
  formData,
  isEditing,
  onClose,
  onEdit,
  onDelete,
  onSelect,
  onChange,
  onSave,
  error,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3">
          ✕
        </button>
        {isEditing ? (
          <CropEditForm
            formData={formData}
            onChange={onChange}
            onSave={onSave}
            error={error}
          />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">{crop.name}</h2>
            <p>품종: {crop.variety}</p>
            <p>유형: {crop.cultivationType}</p>
            <p>면적: {crop.cultivationArea} ㎡</p>
            <p>주소: {crop.cultivationAddress}</p>
            <p>식재일: {crop.plantingDate}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={onEdit}
                className="bg-yellow-400 px-4 py-2 rounded"
              >
                수정
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                삭제
              </button>
              <button
                onClick={onSelect}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                선택하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
