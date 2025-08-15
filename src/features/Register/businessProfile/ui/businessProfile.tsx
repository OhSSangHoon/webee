"use client";

import { useBusinessProfileForm } from "../model/useBusinessProfileForm";
import { postBusinessProfile } from "../api/postBusinessProfile";
import { PostcodeModal } from "./PostcodeModal";
import { useState } from "react";

export default function BusinessProfileForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const {
    form,
    file,
    handleChange,
    handleFileChange,
    removeFile,
    handleInquirySelect,
  } = useBusinessProfileForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      companyName: form.farmName,
      businessAddress: selectedAddress,
      registrationNumber: form.businessNumber,
      representativeName: form.ceoName,
      commencementDate: form.startDate,
      phoneNumber: form.contact,
      onlineStoreUrl: form.onlineStore || undefined,
      kakaoChatUrl:
        form.inquiryMethod === "kakao" && form.kakaoId
          ? `https://pf.kakao.com/${form.kakaoId}`
          : undefined,
      businessCertificateImage: file ?? undefined,
    };

    try {
      const res = await postBusinessProfile(payload);
      alert("등록 완료되었습니다!");
    } catch (error) {
      console.error(error);

      // 502 에러 (사업자등록정보 진위 확인 실패) 처리
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 502) {
          alert(
            "사업자등록정보 진위 확인에 실패했습니다.\n사업자번호, 대표자명, 개업일을 다시 확인해주세요."
          );
        } else if (axiosError.response?.status === 400) {
          alert("잘못된 요청 형식입니다. 입력 정보를 확인해주세요.");
        } else {
          alert("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        alert("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-[1000px] text-black flex flex-col justify-center rounded-2xl items-start shadow-lg text-[14px] "
    >
      <div className="bg-[#EEF2FF] w-full h-[60px] px-4 py-3 rounded-t-2xl">
        <div className="font-semibold text-[16px]">사업자 프로필 등록</div>
        <div className="text-gray-500 text-[12px]">
          양봉업체 정보를 등록하면 상품 등록 기능을 이용할 수 있습니다.
        </div>
      </div>
      <div className="px-15 w-full">
        <div className="w-full bg-amber-100 rounded-sm text-amber-950 text-[12px] px-5 py-2 ">
          앙봉업체이신 경우, 사업자 등록증을 제출하여 인증을 받으시면 판매
          기능을 이용하실 수 <br />
          있습니다. 등록 기능을 이용하지 않을 경우 작성하지 않으셔도 됩니다.
        </div>
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">사업자 등록증 인증</h2>
          <div className="space-y-4">
            <div>
              <label className="block">
                사업자등록번호 <span className="text-red-500">*</span>
              </label>
              <input
                name="businessNumber"
                value={form.businessNumber}
                onChange={handleChange}
                className="custom-Input"
                placeholder="사업자등록번호를 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block">
                대표자명 <span className="text-red-500">*</span>
              </label>
              <input
                name="ceoName"
                value={form.ceoName}
                onChange={handleChange}
                className="custom-Input"
                placeholder="대표자명을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block">
                개업일자 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="custom-Input"
                required
              />
            </div>
            <div>
              <label className="block">사업자 등록증 제출</label>
              <div className="w-full">
                <label className="flex items-center justify-center border-3 border-dashed border-gray-300 rounded-md px-4 py-15 cursor-pointer">
                  <div
                    className="flex flex-col justify-center
                  items-center "
                  >
                    <div className="block text-gray-500 text-sm mb-2">
                      사업자 등록증 이미지를 올려주세요
                    </div>
                    <div className="text-gray-500 border border-gray-300 bg-gray-100 px-3 py-1 rounded text-sm">
                      파일 선택
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && (
                  <div className="w-fit mt-2 flex items-center justify-between bg-gray-100 px-4 py-2 rounded text-sm text-gray-700">
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={removeFile}
                      className="ml-5 text-gray-500 hover:text-red-700  cursor-pointer"
                    >
                      x
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 양봉업체 정보 입력 */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">양봉업체 정보 입력</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">
                업체명 <span className="text-red-500">*</span>
              </label>
              <input
                name="farmName"
                value={form.farmName}
                onChange={handleChange}
                className="custom-Input"
                placeholder="업체명을 입력하세요"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block">
              양봉장 위치 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row justify-center items-center gap-5">
              <button
                onClick={() => setIsOpen(true)}
                className=" px-4 py-2 h-fit rounded-sm  border-blue-500 border-2 text-blue-500 w-30 hover:border-black hover:text-black  cursor-pointer"
              >
                주소 검색
              </button>
              <input
                className="custom-Input"
                required
                readOnly
                value={
                  selectedAddress
                    ? `주소 ${selectedAddress}`
                    : "주소를 검색해주세요! 미입력시 등록이 불가합니다!"
                }
              />

              {isOpen && (
                <PostcodeModal
                  setIsOpen={setIsOpen}
                  onComplete={(address) => {
                    setSelectedAddress(address);
                  }}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="custom-Input"
                placeholder="000-0000-0000"
                required
              />
            </div>
            <div>
              <label className="block">온라인 스토어 링크</label>
              <input
                name="onlineStore"
                value={form.onlineStore}
                onChange={handleChange}
                className="custom-Input"
                placeholder="http://"
              />
            </div>
          </div>
        </section>

        {/* 문의 방법 설정 */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">문의 방법 설정</h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleInquirySelect("phone")}
              className={`px-4 py-2 border rounded  cursor-pointer ${
                form.inquiryMethod === "phone" ? "bg-blue-500 text-white" : ""
              }`}
            >
              전화 문의
              <div>고객이 등록된 전화번호로 직접 연락할 수 있습니다. </div>
            </button>
            <button
              type="button"
              onClick={() => handleInquirySelect("kakao")}
              className={`px-4 py-2 border rounded  cursor-pointer ${
                form.inquiryMethod === "kakao" ? "bg-blue-500 text-white" : ""
              }`}
            >
              카카오톡 문의
              <div>카카오톡을 통해 문의를 받습니다.</div>
            </button>
          </div>
          {form.inquiryMethod === "kakao" && (
            <div className="mt-4">
              <label className="block">카카오톡 ID</label>
              <input
                name="kakaoId"
                value={form.kakaoId}
                onChange={handleChange}
                className="custom-Input"
                placeholder="카카오톡 ID를 입력하세요"
              />
            </div>
          )}
        </section>

        {/* 등록 버튼 */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-500 text-white px-20 py-2 rounded my-5 "
          >
            등록하기
          </button>
        </div>
      </div>
    </form>
  );
}
