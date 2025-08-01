import { Crop } from "@/shared/types/crop";
import CropEditForm from "./cropEditForm";
import { getCultivationTypeKorean } from "@/shared/utils/cultivationUtils";

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
  onEdit,
  onDelete,
  onSelect,
  onChange,
  onSave,
  error,
}: Props) {
  return (
    <div className="border-[#ececec] border-2 rounded px-4 py-2 mt-3">
      {isEditing ? (
        <CropEditForm
          formData={formData}
          onChange={onChange}
          onSave={onSave}
          error={error}
        />
      ) : (
        <>
          <h2 className="text-base font-medium mb-2">
            {crop.name} ({crop.variety})
          </h2>
          <p>유형 - {getCultivationTypeKorean(crop.cultivationType ?? "")}</p>
          <p>면적 - {crop.cultivationArea} ㎡</p>
          <p>주소 - {crop.cultivationAddress}</p>
          <p>식재일 - {crop.plantingDate}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={onEdit}
              className="cursor-pointer border border-[#ececec] rounded px-4 hover:shadow-md transition"
            >
              수정
            </button>
            <button
              onClick={onDelete}
              className="cursor-pointer border border-[#ececec] rounded px-4 hover:shadow-md transition"
            >
              삭제
            </button>
            <button
              onClick={onSelect}
              className=" border border-blue-500 text-blue-500 px-4 py-2 rounded hover:shadow-md transition"
            >
              선택하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
