import { Crop } from "@/shared/types/crop";

type Props = {
  crops: Crop[];
  onSelect: (id: number) => void;
};

export default function CropList({ crops, onSelect }: Props) {
  return (
    <ul className="flex flex-col gap-3 text-[#333333] h-[15rem] overflow-y-auto">
      {crops.map((crop) => (
        <li
          key={crop.id}
          onClick={() => onSelect(crop.id)}
          className="cursor-pointer border border-[#ececec] rounded-lg p-2 hover:shadow-md transition"
        >
          <h2 className="text-base font-medium">{crop.name}</h2>
        </li>
      ))}
    </ul>
  );
}
