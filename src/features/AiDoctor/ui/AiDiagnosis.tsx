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
    <div className="flex flex-col justify-start items-start w-full gap-4 ">
      <header className="font-semibold flex flex-row items-end space-x-2 text-[20px] w-full">
        <div className="text-blue-700 font-semibold">Step 1</div> 꿀벌 사진 업로드
        <div className="text-blue-700 text-[13px] mb-1 mx-2 font-medium">
          꿀벌 사진을 업로드하여 응애, 부저병, 날개불구바이러스감염증, 석고병
          질병 여부를 진단받을 수 있어요!
        </div>
      </header>

      <div className="w-full flex flex-col lg:flex-row lg:h-[15rem] space-y-4 space-x-2">
        {/* 커스텀 파일 업로드 박스 */}

        <div className="flex flex-col gap-3 w-full h-full">
          <div
            className="border-2 border-dashed border-[#ececec] rounded-lg h-[120px] lg:h-full flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage ? (
              <Image
                src={previewImage}
                alt="선택한 이미지"
                width={300}
                height={200}
                className="object-contain h-full w-full"
              />
            ) : (
              <>
                <Camera className="w-8 h-8 text-gray-700" />
                <p className="text-gray-700 text-sm mt-2">
                  사진을 선택해주세요
                </p>
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
        </div>

        {/* 예시 이미지 안내 영역 */}
        <div className="p-5 border-2 border-[#ececec] rounded-lg w-full min-h-[15rem] flex flex-col justify-center items-start ">
          <div>꿀벌이 잘 보이도록 확대해서 찍어주세요. </div>
          <div className="flex flex-row justify-center items-center w-full h-full gap-4 lg:gap-10">
            <div className="flex-1 h-40">
              <Image
                src="/images/bee1.webp"
                alt="예시 꿀벌1"
                priority
                fetchPriority="high"
                width={200}
                height={160}
                sizes="(max-width: 768px) 33vw, 200px"
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
            <div className="flex-1 h-40">
              <Image
                src="/images/bee2.webp"
                alt="예시 꿀벌2"
                priority
                fetchPriority="high"
                width={200}
                height={160}
                sizes="(max-width: 768px) 33vw, 200px"
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
            <div className="flex-1 h-40">
              <Image
                src="/images/bee3.webp"
                alt="예시 꿀벌3"
                priority
                fetchPriority="high"
                width={200}
                height={160}
                sizes="(max-width: 768px) 33vw, 200px"
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
          </div>
          <div className="flex justify-end items-end text-sm text-gray-700">
            <span className="">※ 위의 예시 이미지를 참고해주세요.</span>
          </div>
        </div>
      </div>
      {/* 버튼 */}
      <button
        className={`white-button text-base w-[10rem]  ml-auto ${
          loading ? "loading" : ""
        }`}
        onClick={apifunc}
      >
        {loading ? "진단 중..." : "진단 요청"}
      </button>

      {result && (
        <div className="p-8 bg-[#ffebf6] rounded-lg w-full">
          <div className="flex flex-col gap-7">
            <header className="flex flex-col items-start justify-start">
              <h2 className="text-lg font-semibold">병명 - {result.name}</h2>
              <h3 className="text-sm">{result.description}</h3>
              <div className="text-sm text-pink-600 font-medium">
                정확도: {result.confidence}
              </div>
            </header>

            {Array.isArray(result.symptoms) && (
              <div className="flex flex-col">
                <div className="font-semibold"> {result.name}의 주요 증상</div>
                <ul className="list-disc text-base leading-relaxed px-4">
                  {result.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.cause && (
              <div>
                <div className="font-semibold">전파 요인</div>
                <div className=" text-sm ">{result.cause}</div>
              </div>
            )}

            {result.severity && (
              <div>
                <div className="font-semibold">심각도</div>
                <div className=" text-sm ">{result.severity}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
