"use client";

import { useBusinessProfileForm, BusinessProfileFormValues } from "../model/useBusinessProfileForm";
import { postBusinessProfile } from "../api/postBusinessProfile";
import { PostcodeModal } from "./PostcodeModal";
import { useState } from "react";

export default function BusinessProfileForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const {
    form,
    file,
    handleFileChange,
    removeFile,
    handleInquirySelect,
  } = useBusinessProfileForm();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = form;
  const inquiryMethod = watch("inquiryMethod");

  const onSubmit = async (data: BusinessProfileFormValues) => {
    const payload = {
      companyName: data.farmName,
      businessAddress: selectedAddress,
      registrationNumber: data.businessNumber,
      representativeName: data.ceoName,
      commencementDate: data.startDate,
      phoneNumber: data.contact,
      onlineStoreUrl: data.onlineStore || undefined,
      kakaoChatUrl:
        data.inquiryMethod === "kakao" && data.kakaoId.trim()
          ? `https://pf.kakao.com/${data.kakaoId}`
          : undefined,
      businessCertificateImage: file ?? undefined,
    };

    try {
      await postBusinessProfile(payload);
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
      onSubmit={handleSubmit(onSubmit)}
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
                {...register("businessNumber")}
                className="custom-Input"
                placeholder="사업자등록번호를 입력하세요"
              />
              {errors.businessNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.businessNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block">
                대표자명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register("ceoName")}
                className="custom-Input"
                placeholder="대표자명을 입력하세요"
              />
              {errors.ceoName && (
                <p className="text-red-500 text-sm mt-1">{errors.ceoName.message}</p>
              )}
            </div>
            <div>
              <label className="block">
                개업일자 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="custom-Input"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
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
                {...register("farmName")}
                className="custom-Input"
                placeholder="업체명을 입력하세요"
              />
              {errors.farmName && (
                <p className="text-red-500 text-sm mt-1">{errors.farmName.message}</p>
              )}
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
                {...register("contact")}
                className="custom-Input"
                placeholder="000-0000-0000"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
              )}
            </div>
            <div>
              <label className="block">온라인 스토어 링크</label>
              <input
                {...register("onlineStore")}
                className="custom-Input"
                placeholder="http://"
              />
              {errors.onlineStore && (
                <p className="text-red-500 text-sm mt-1">{errors.onlineStore.message}</p>
              )}
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
                inquiryMethod === "phone" ? "bg-blue-500 text-white" : ""
              }`}
            >
              전화 문의
              <div>고객이 등록된 전화번호로 직접 연락할 수 있습니다. </div>
            </button>
            <button
              type="button"
              onClick={() => handleInquirySelect("kakao")}
              className={`px-4 py-2 border rounded  cursor-pointer ${
                inquiryMethod === "kakao" ? "bg-blue-500 text-white" : ""
              }`}
            >
              카카오톡 문의
              <div>카카오톡을 통해 문의를 받습니다.</div>
            </button>
          </div>
          {errors.inquiryMethod && (
            <p className="text-red-500 text-sm mt-1">{errors.inquiryMethod.message}</p>
          )}
          {inquiryMethod === "kakao" && (
            <div className="mt-4">
              <label className="block">카카오톡 ID</label>
              <input
                {...register("kakaoId")}
                className="custom-Input"
                placeholder="카카오톡 ID를 입력하세요"
              />
              {errors.kakaoId && (
                <p className="text-red-500 text-sm mt-1">{errors.kakaoId.message}</p>
              )}
            </div>
          )}
        </section>

        {/* 등록 버튼 */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-500 text-white px-20 py-2 rounded my-5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </form>
  );
}
