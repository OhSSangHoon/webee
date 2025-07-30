'use client';

import { getBeeTypeKorean, ALL_BEE_TYPES_EN } from '@/shared/types/beeSwitch';

interface BeeTypeFilterProps {
  selectedBeeType: string | null;
  onBeeTypeChange: (beeType: string | null) => void;
}

export function BeeTypeFilter({ selectedBeeType, onBeeTypeChange }: BeeTypeFilterProps) {

  return (
    <div className="w-full p-4 border-b border-gray-200 flex-shrink-0 h-[80px] flex items-center">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onBeeTypeChange(null)}
          className={`px-3 py-2 rounded-full text-xs transition-colors ${
            selectedBeeType === null 
              ? 'bg-blue-500 text-white font-medium' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-label="전체 벌 종류 보기"
          type="button"
        >
          전체
        </button>
        {ALL_BEE_TYPES_EN.map((beeType) => (
          <button
            key={beeType}
            onClick={() => onBeeTypeChange(beeType)}
            className={`px-3 py-2 rounded-full text-xs transition-colors ${
              selectedBeeType === beeType 
                ? 'bg-blue-500 text-white font-medium' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={`${getBeeTypeKorean(beeType)} 필터 적용`}
            type="button"
          >
            {getBeeTypeKorean(beeType)}
          </button>
        ))}
      </div>
    </div>
  );
}