"use client";
import api from "@/shared/auth/lib";
import { useRef } from "react";

export default function AiDiagnosisUI() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const apifunc = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("beeImage", file); // ✅ 서버가 요구하는 이름

    try {
      const response = await api.post("/bee/diagnosis", formData);
      console.log(response.data);
    } catch (error) {
      console.error("진단 요청 실패:", error);
    }
  };
  return (
    <div className=" flex flex-col justify-start items-stretch w-full h-full gap-4 card-section-2">
      <div>
        <h2 className="text-2xl font-bold">
          <span className="text-blue-500 text-3xl">Step 1</span> AI 꿀벌
          질병진단
        </h2>
        <div>꿀벌 이미지 질병 판단을 통해 6가지 병을 판단합니다.</div>
      </div>{" "}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="border"
        />
        <button className="border" onClick={apifunc}>
          진단 요청
        </button>
      </div>
      <div className="border-4 border-gray-400 rounded-2xl w-full h-50 flex flex-col justify-center items-center gap-2">
        <div>꿀벌이 잘 보이도록 확대해서 찍어주세요.</div>
        <div className="flex flex-row justify-around w-full h-[60%]">
          <div className="border bg-amber-950 w-[30%] h-full ">ㅇ</div>
          <div className="border bg-amber-950 w-[1/3] h-full "></div>
          <div className="border bg-amber-950 w-[1/3] h-full "></div>
        </div>
        <div className="flex justify-end items-end">
          ※위의 예시 이미지를 참고해주세요.
        </div>
      </div>
    </div>
  );
}
