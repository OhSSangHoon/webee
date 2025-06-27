"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Sparkles, AlertCircle, Lightbulb } from "lucide-react";
import clsx from "clsx";
import { useRecommendBee } from "../model/useRecommendation";
import { useSaveRecommendation } from "../model/useSaveRecommendation";

export default function ResultBox() {
  const { resultData, isSuccess, loading } = useRecommendBee();
  const [tab, setTab] = useState<"info" | "products">("info");
  const [isSave, setIsSave] = useState(""); // 메시지용
  const [canSave, setCanSave] = useState(false); // 버튼 활성화용

  const save = useSaveRecommendation(resultData, setIsSave);

  useEffect(() => {
    const token = typeof window !== "undefined" 
      ? localStorage.getItem("accessToken") 
      : null;
      
    if (token) {
      setCanSave(true);
    } else {
      setCanSave(false);
      setIsSave("로그인 시 저장 가능해요!");
    }
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-stretch w-full h-full card-section">
      {!isSuccess && !loading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center gap-1 font-bold  ">
          <div className=" text-black text-3xl  text-center">
            입력 정보를 바탕으로
            <br />
            추천 결과가 제공됩니다!
          </div>
          <div className="text-xl text-blue-500">
            작물 정보를 작성해주세요😆
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center gap-1 font-bold  ">
          <div className=" text-black text-3xl  text-center">
            벌들이 추천 정보를 열심히
            <br />
            나르고 있어요!
          </div>
          <div className="text-xl text-blue-500">잠시만 기다려 주세요😆</div>
        </div>
      )}
      <h3 className="text-2xl font-bold">🐝 수정벌 상세 정보</h3>

      <div className="relative bg-indigo-50 border border-indigo-200 text-indigo-800 p-5 rounded-xl shadow-sm flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="font-semibold">{resultData.beeType}</div>
          <span className="text-xs bg-indigo-600 text-white rounded-full px-2 py-0.5 font-semibold">
            추천
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays className="w-5 h-5" />
          투입 적정 시기
        </div>
        <div className="text-lg font-extrabold">
          {resultData.inputStartDate} ~ {resultData.inputEndDate}
        </div>
        <div className="text-xs text-gray-500 italic">
          * 해당 기간에 투입하는 것이 가장 효과적입니다
        </div>
      </div>

      <div className="flex border-b border-gray-300 mt-4">
        <button
          onClick={() => setTab("info")}
          className={clsx(
            "px-4 py-2 text-sm font-semibold transition-colors",
            tab === "info"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-400 hover:text-indigo-600"
          )}
        >
          특징 및 주의사항
        </button>
        <button
          onClick={() => setTab("products")}
          className={clsx(
            "px-4 py-2 text-sm font-semibold transition-colors",
            tab === "products"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-400 hover:text-indigo-600"
          )}
        >
          추천 상품
        </button>
      </div>

      {tab === "info" ? (
        <div className="space-y-6 mt-4">
          <Section
            icon={<Sparkles className="w-5 h-5 text-green-500" />}
            title="주요 특징"
            items={resultData.characteristics}
          />
          <Section
            icon={<AlertCircle className="w-5 h-5 text-yellow-500" />}
            title="주의 사항"
            items={resultData.caution}
          />
          <TipSection
            icon={<Lightbulb className="w-5 h-5 text-indigo-500" />}
            title="투입 팁"
            items={resultData.usageTip}
          />
        </div>
      ) : (
        <div className="text-sm text-gray-400 py-6 px-2 italic text-center">
          추천 상품 정보가 아직 없습니다.
        </div>
      )}

      <button
        disabled={!canSave}
        onClick={save}
        className="w-full border rounded border-indigo-600 text-indigo-600 hover:bg-indigo-50 mt-5 py-2"
      >
        저장하기
      </button>
      <div>{isSave}</div>
    </div>
  );
}

function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-700">
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TipSection({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
      <div className="flex items-center gap-2 border-b pb-2 border-gray-200">
        {icon}
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      </div>
      <ul className="text-sm space-y-1 text-gray-700 list-none pl-2 relative">
        {items.map((item, idx) => (
          <li key={idx} className="pl-4 relative leading-relaxed">
            <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
