"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useRecommendBee } from "../model/useRecommendation";
import { useSaveRecommendation } from "../model/useSaveRecommendation";
import { safeLocalStorage } from "@/shared/utils/localStorage";
import { useProducts } from "../model/useProducts";
import { ProductsSection } from "./recommendProduct";

export function Section({
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
        <h4 className="card-title ">{title}</h4>
      </div>
      <ul className=" list-disc card-content ">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultBox() {
  const { resultData, isSuccess, loading } = useRecommendBee();
  const { products, loading: productsLoading, loadProducts } = useProducts();
  const [tab, setTab] = useState<"info" | "products">("info");
  const [isSave, setIsSave] = useState("");
  const [canSave, setCanSave] = useState(false);

  const save = useSaveRecommendation(resultData, setIsSave);

  useEffect(() => {
    if (tab === "products" && isSuccess) {
      loadProducts();
    }
  }, [tab, isSuccess, loadProducts]);

  useEffect(() => {
    const token = safeLocalStorage.getItem("accessToken");
    if (token) {
      setCanSave(true);
    } else {
      setCanSave(false);
      setIsSave("로그인 시 저장 가능해요!");
    }
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-stretch w-full h-full card-section gap-4">
      {!isSuccess && !loading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center gap-1 font-bold  ">
          <div className=" text-black text-3xl  text-center">
            입력 정보를 바탕으로
            <br />
            추천 결과가 제공됩니다!
          </div>
          <div className="text-xl text-red-500">작물 정보를 작성해주세요😆</div>
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

      <div className="flex flex-row gap-4">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src="/beeEx.svg"
            alt="수정벌 이미지"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <div className="title-large mb-2">{resultData.beeType}</div>
          <div className="title-sub-900">투입 적정 시기</div>
          <div className="title-sub">
            {resultData.inputStartDate} ~ {resultData.inputEndDate}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <button
          onClick={() => setTab("info")}
          className={clsx("button-orange", tab === "info" ? "" : "button-none")}
        >
          특징 및 주의사항
        </button>
        <button
          onClick={() => setTab("products")}
          className={clsx(
            "button-orange",
            tab === "products" ? "" : "button-none"
          )}
        >
          추천 상품
        </button>
      </div>

      {tab === "info" ? (
        <div className="card-gray overflow-y-auto space-y-8 text-main-900  ">
          <Section
            icon={
              <div className="relative w-5 h-5">
                <Image src="/note.svg" alt="노트 아이콘" fill className="object-contain" />
              </div>
            }
            title="주요 특징"
            items={resultData.characteristics}
          />

          <Section
            icon={
              <div className="relative w-5 h-5">
                <Image src="/caution.svg" alt="주의 아이콘" fill className="object-contain" />
              </div>
            }
            title="주의 사항"
            items={resultData.caution}
          />

          <Section
            icon={
              <div className="relative w-5 h-5">
                <Image src="/search.svg" alt="검색 아이콘" fill className="object-contain" />
              </div>
            }
            title="투입 팁"
            items={resultData.usageTip}
          />

          <button
            disabled={!canSave}
            onClick={save}
            className="w-full border rounded border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2  cursor-pointer"
          >
            저장하기
          </button>
          {isSave}
        </div>
      ) : (
        <ProductsSection
          products={products}
          loading={productsLoading}
          beeType={resultData.beeType}
        />
      )}
    </div>
  );
}
