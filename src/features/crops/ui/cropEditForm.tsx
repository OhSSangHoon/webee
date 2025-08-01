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
    <div className="font-medium">
      <label className="block mb-1  ">
        이름 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
        className="crop-input-box"
      />

      <label className="block mb-1 ">품종</label>
      <input
        type="text"
        value={formData.variety || ""}
        onChange={(e) => onChange({ ...formData, variety: e.target.value })}
        className="crop-input-box"
      />

      <label className="block mb-1 ">재배 방식</label>
      <select
        className="crop-input-box"
        value={formData.cultivationType || ""}
        onChange={(e) =>
          onChange({ ...formData, cultivationType: e.target.value })
        }
      >
        <option value="OPEN_FIELD">노지</option>
        <option value="CONTROLLED">시설재배</option>
      </select>

      <label className="block mb-1 ">재배지 주소</label>
      <input
        type="text"
        value={formData.cultivationAddress || ""}
        onChange={(e) =>
          onChange({ ...formData, cultivationAddress: e.target.value })
        }
        className="crop-input-box"
      />

      <label className="block mb-1 ">재배 면적 (㎡)</label>
      <input
        type="number"
        value={formData.cultivationArea || ""}
        onChange={(e) =>
          onChange({ ...formData, cultivationArea: Number(e.target.value) })
        }
        className="crop-input-box"
      />

      <label className="block mb-1 ">파종 날짜</label>
      <input
        type="date"
        value={formData.plantingDate || ""}
        onChange={(e) =>
          onChange({ ...formData, plantingDate: e.target.value })
        }
        className="crop-input-box"
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
