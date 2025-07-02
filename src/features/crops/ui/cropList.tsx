import { Crop } from "@/shared/types/crop";

type Props = {
  crops: Crop[];
  onSelect: (id: number) => void;
};

export default function CropList({ crops, onSelect }: Props) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {crops.map((crop) => (
        <li
          key={crop.id}
          onClick={() => onSelect(crop.id)}
          className="cursor-pointer border rounded-xl p-4 shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{crop.name}</h2>
        </li>
      ))}
    </ul>
  );
}
