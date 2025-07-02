import React from "react";
import { BeeRecommendationDetail } from "../model/types";
import { CalendarDays } from "lucide-react"; // lucide 아이콘 사용 시 설치 필요
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";

type Props = {
  detail: BeeRecommendationDetail;
  onClose: () => void;
};

export const BeeRecommendationDetailModal = ({ detail, onClose }: Props) => {
  const {
    beeType,
    inputStartDate,
    inputEndDate,
    characteristics,
    caution,
    usageTip,
  } = detail;

  const splitToLines = (text: string) => text.split("\n");

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div className="bg-white p-6 w-[90%] max-w-xl rounded-2xl shadow-2xl animate-fade-in">
        {/* 투입 적정 시기 카드 */}
        <div className="relative bg-white border-t-4 border-pink-500 p-4 rounded-xl shadow flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900">
              {getBeeTypeKorean(beeType)}
            </h3>
            <span className="text-[10px] bg-pink-500 text-white rounded-full px-2 py-0.5 font-medium tracking-tight">
              추천
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 font-medium mt-1">
            <CalendarDays className="w-4 h-4 mr-1 text-pink-500" />
            투입 적정 시기
          </div>

          <div className="text-lg font-bold text-pink-600">
            {inputStartDate} ~ {inputEndDate}
          </div>

          <p className="text-xs text-gray-400 italic">
            ※ 해당 기간에 투입하는 것이 가장 효과적입니다
          </p>
        </div>

        {/* 특징 */}
        <div className="mb-4 px-5">
          <p className="font-semibold mb-1">🐝 특징</p>
          <ul className=" text-gray-700 space-y-1">
            {splitToLines(characteristics).map((line, idx) => (
              <li key={`char-${idx}`}>{line}</li>
            ))}
          </ul>
        </div>

        {/* 주의사항 */}
        <div className="mb-4 px-5">
          <p className="font-semibold mb-1">⚠️ 주의사항</p>
          <ul className=" text-gray-700 space-y-1">
            {splitToLines(caution).map((line, idx) => (
              <li key={`caution-${idx}`}>{line}</li>
            ))}
          </ul>
        </div>

        {/* 사용팁 */}
        <div className="mb-4 px-5">
          <p className="font-semibold mb-1">💡 사용 팁</p>
          <ul className=" text-gray-700 space-y-1">
            {splitToLines(usageTip).map((line, idx) => (
              <li key={`tip-${idx}`}>{line}</li>
            ))}
          </ul>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-200 active:scale-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
