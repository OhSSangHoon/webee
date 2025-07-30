"use client";

import api from "@/shared/auth/lib";
import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { DiagnosisResult } from "@/shared/types/diagnosis";

type AiDiagnosisUIProps = {
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setResult: React.Dispatch<React.SetStateAction<DiagnosisResult | null>>;
  result: DiagnosisResult | null;
};

export default function AiDiagnosisUI({
  setImageFile,
  setResult,
  result,
}: AiDiagnosisUIProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apifunc = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("beeImage", file);
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post("/bee/diagnosis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setResult(response.data.data);
    } catch (error) {
      console.error("진단 요청 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 허용된 MIME 타입
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "JPG, JPEG, PNG, SVG, WEBP 형식의 이미지 파일만 업로드할 수 있습니다."
      );
      e.target.value = ""; // 파일 초기화
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  return (
    <div className="flex flex-col justify-start items-start w-full gap-4 card-section-2">
      <div>
        <h2 className="text-2xl font-bold">
          <span className="text-blue-500 text-3xl">Step 1</span> 꿀벌 사진
          업로드
        </h2>
        <div>
          꿀벌 사진을 업로드하여 응애, 부저병, 날개불구바이러스감염증, 석고병
          질병 여부를 진단받을 수 있어요!
        </div>
      </div>

      {/* 커스텀 파일 업로드 박스 */}
      <div className="flex flex-col gap-3 w-full">
        <div
          className="border-2 border-dashed border-[#d9d9d9] rounded-xl h-[120px] flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt="선택한 이미지"
              className="object-contain h-full w-full"
            />
          ) : (
            <>
              <Camera className="w-8 h-8 text-gray-500" />
              <p className="text-gray-500 text-sm mt-2">사진을 선택해주세요</p>
            </>
          )}
        </div>

        {/* 실제 input은 숨김 */}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.svg,.webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 버튼 */}
        <button
          className={`white-button ${loading ? "loading" : ""}`}
          onClick={apifunc}
        >
          {loading ? "진단 중..." : "진단 요청"}
        </button>
      </div>

      {/* 예시 이미지 안내 영역 */}
      <div className="p-4 bg-[#ffdf8e] rounded-2xl w-full min-h-[40rem] flex flex-col justify-center items-center">
        <div>꿀벌이 잘 보이도록 확대해서 찍어주세요. </div>
        <div className="flex flex-col justify-center items-center w-full h-full gap-10">
          <div className="w-2/3 h-40 relative">
            <Image
              src="/images/bee1.jpg"
              alt="예시 꿀벌1"
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              fill
              className="object-cover rounded-lg border"
            />
          </div>
          <div className="w-2/3 h-40 relative">
            <Image
              src="/images/bee2.jpg"
              alt="예시 꿀벌2"
              sizes="(max-width: 768px) 100vw, 66vw"
              fill
              className="object-cover rounded-lg border"
            />
          </div>
          <div className="w-2/3 h-40 relative">
            <Image
              src="/images/bee3.jpg"
              alt="예시 꿀벌3"
              sizes="(max-width: 768px) 100vw, 66vw"
              fill
              className="object-cover rounded-lg border"
            />
          </div>
        </div>
        <div className="flex justify-end items-end text-sm text-gray-600">
          ※위의 예시 이미지를 참고해주세요.
        </div>
      </div>

      {result && (
        <div className="p-6 bg-[#FCE7F3] rounded-xl shadow-md space-y-4">
          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold text-black">
              {result.name}
              <p className="text-sm text-pink-500">
                정확도: {result.confidence}
              </p>
            </h3>

            <p className="text-pink-600">{result.description}</p>

            {Array.isArray(result.symptoms) && (
              <div className="flex flex-col">
                <strong>주요 증상</strong>
                <ul className="list-inside text-sm text-gray-700">
                  {result.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.cause && (
              <div>
                <strong>전파 요인</strong>
                <div>{result.cause}</div>
              </div>
            )}

            {result.severity && (
              <div>
                <strong>심각도</strong>
                <div>{result.severity}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
