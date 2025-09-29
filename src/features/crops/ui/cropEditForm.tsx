// features/crops/components/CropEditForm.tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Crop } from "@/shared/types/crop";
import { useEffect } from "react";

type CropEditFormValues = {
  name: string;
  variety: string;
  cultivationType: string;
  cultivationAddress: string;
  cultivationArea: number;
  plantingDate: string;
};

const schema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  variety: yup.string().default(""),
  cultivationType: yup.string().required("재배 방식을 선택해주세요."),
  cultivationAddress: yup.string().default(""),
  cultivationArea: yup.number().default(0).positive("재배 면적은 양수여야 합니다."),
  plantingDate: yup.string().default(""),
});

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CropEditFormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const watchedValues = watch();

  useEffect(() => {
    setValue("name", formData.name || "");
    setValue("variety", formData.variety || "");
    setValue("cultivationType", formData.cultivationType || "OPEN_FIELD");
    setValue("cultivationAddress", formData.cultivationAddress || "");
    setValue("cultivationArea", formData.cultivationArea || 0);
    setValue("plantingDate", formData.plantingDate || "");
  }, [formData, setValue]);

  useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  const onSubmit = () => {
    onSave();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-medium">
      <label className="block mb-1">
        이름 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("name")}
        className="crop-input-box"
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
      )}

      <label className="block mb-1">품종</label>
      <input
        type="text"
        {...register("variety")}
        className="crop-input-box"
      />
      {errors.variety && (
        <p className="text-red-500 text-sm mt-1">{errors.variety.message}</p>
      )}

      <label className="block mb-1">재배 방식 <span className="text-red-500">*</span></label>
      <select
        {...register("cultivationType")}
        className="crop-input-box"
      >
        <option value="OPEN_FIELD">노지</option>
        <option value="CONTROLLED">시설재배</option>
      </select>
      {errors.cultivationType && (
        <p className="text-red-500 text-sm mt-1">{errors.cultivationType.message}</p>
      )}

      <label className="block mb-1">재배지 주소</label>
      <input
        type="text"
        {...register("cultivationAddress")}
        className="crop-input-box"
      />
      {errors.cultivationAddress && (
        <p className="text-red-500 text-sm mt-1">{errors.cultivationAddress.message}</p>
      )}

      <label className="block mb-1">재배 면적 (㎡)</label>
      <input
        type="number"
        {...register("cultivationArea")}
        className="crop-input-box"
      />
      {errors.cultivationArea && (
        <p className="text-red-500 text-sm mt-1">{errors.cultivationArea.message}</p>
      )}

      <label className="block mb-1">파종 날짜</label>
      <input
        type="date"
        {...register("plantingDate")}
        className="crop-input-box"
      />
      {errors.plantingDate && (
        <p className="text-red-500 text-sm mt-1">{errors.plantingDate.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
      >
        저장
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
