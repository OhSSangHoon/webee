// features/crops/components/CropEditForm.tsx
import { Crop } from "@/shared/types/crop";

type Props = {
  formData: Partial<Crop>;
  onChange: (form: Partial<Crop>) => void;
  onSave: () => void;
  error?: string | null;
};

export default function CropEditForm({
  formData,
  onChange,
  onSave,
  error,
}: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">
        이름 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
        className="border w-full p-2 mb-2"
      />

      <label className="block mb-1 font-medium">품종</label>
      <input
        type="text"
        value={formData.variety || ""}
        onChange={(e) => onChange({ ...formData, variety: e.target.value })}
        className="border w-full p-2 mb-2"
      />

      <label className="block mb-1 font-medium">재배 방식</label>
      <input
        type="text"
        value={formData.cultivationType || ""}
        onChange={(e) =>
          onChange({ ...formData, cultivationType: e.target.value })
        }
        className="border w-full p-2 mb-2"
      />

      <label className="block mb-1 font-medium">재배지 주소</label>
      <input
        type="text"
        value={formData.cultivationAddress || ""}
        onChange={(e) =>
          onChange({ ...formData, cultivationAddress: e.target.value })
        }
        className="border w-full p-2 mb-2"
      />

      <label className="block mb-1 font-medium">재배 면적 (㎡)</label>
      <input
        type="number"
        value={formData.cultivationArea || ""}
        onChange={(e) =>
          onChange({ ...formData, cultivationArea: Number(e.target.value) })
        }
        className="border w-full p-2 mb-2"
      />

      <label className="block mb-1 font-medium">파종 날짜</label>
      <input
        type="date"
        value={formData.plantingDate || ""}
        onChange={(e) =>
          onChange({ ...formData, plantingDate: e.target.value })
        }
        className="border w-full p-2 mb-2"
      />

      <button
        onClick={onSave}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
      >
        저장
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
