"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/shared/auth/useUserStore";
import { useRouter } from "next/navigation";
import { createProduct } from "@/features/products/api/api";
import { productData, BeeType } from "@/features/products/model/model";


export default function ProductsPage() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{url: string}[]>([]);
  
  const [productData, setProductData] = useState<productData>({
    name: "",
    price: 0, // 숫자 타입으로 초기화
    beeType: "" as BeeType, // 타입 캐스팅
    content: "",
  });

  // 토큰 확인
  useEffect(() => {
    console.log(isLoggedIn);

    const token = localStorage.getItem("accessToken");
    setAuthToken(token);

    setIsLoading(false);

    if(isLoading === false && isLoggedIn === false) {
      alert("로그인이 필요한 서비스입니다.");
      router.replace("/signIn");
    }

  }, [isLoggedIn, router]);

  // 입력값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setProductData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 0,
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 선택한 파일들을 imageFiles 상태에 추가
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    
    // imageFiles 상태에 추가된 파일들을 미리보기 URL로 변환하여 uploadedImages 상태에 추가
    newFiles.forEach(file => {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages(prev => [...prev, { url: imageUrl }]);
    });
  };

  // 이미지 삭제 처리
  const handleDeleteImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    
    if (uploadedImages[index]?.url) {
      URL.revokeObjectURL(uploadedImages[index].url);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 필수 입력값 확인
    if (!productData.name || !productData.beeType || productData.price <= 0) {
      alert("상품명, 벌 종류, 가격은 필수 입력사항입니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 상품 생성 API 호출 - Swagger 문서에 맞춰 구현
      await createProduct(productData, imageFiles);

      alert("상품이 성공적으로 등록되었습니다.");

      router.push("/"); // 상품 목록 페이지로 이동
      return;
    } catch (error) {
      console.error("상품 등록 오류:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-10">
      <div className="w-5xl h-full rounded-2xl shadow-custom mb-10">
        <div className="w-full h-[90px] flex flex-col card-top">
            <div className="w-full h-[60px] flex flex-col m-5">
                <p className="card-title">상품 등록</p>
                <p className="text-[#6B7280] text-sm font-normal mt-1">
                    상품 등록 페이지입니다.
                </p>
            </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-10">
              <div className="warning">
                  <img src="/warning.svg" alt="warning" className="w-5 h-5" />
                  <div className="flex flex-col ml-3">
                      <p className="warning-title">
                          상품 등록 주의사항
                      </p>
                      <ul className="warning-list">
                          <li>벌 종류, 가격은 필수 입력 항목입니다.</li>
                          <li>부정확한 정보 기재 시 서비스 이용에 제한이 있을 수 있습니다.</li>
                          <li>타인의 지적 재산권을 침해하는 이미지 사용은 금지됩니다.</li>
                      </ul>
                  </div>
              </div>
              {/* 상품 이미지 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">상품 이미지</p>
                  <p className="text-red-500 mx-2">*</p>
                  <p className="text-[#6B7280] text-xs font-normal">첫 번째 이미지가 썸네일로 사용됩니다.</p>
              </div>
              {/* 이미지 업로드 영역 */}
              <div>
                  <div className="flex flex-wrap gap-4">
                      {/* 업로드된 이미지 표시 */}
                      {uploadedImages.map((image, index) => (
                          <div key={index} className="relative w-25 h-25 border border-gray-300 rounded-md overflow-hidden">
                              <img 
                                  src={image.url} 
                                  alt={`상품 이미지 ${index + 1}`} 
                                  className="w-full h-full object-cover"
                              />
                              <button 
                                  type="button"
                                  className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1"
                                  onClick={() => handleDeleteImage(index)}
                              >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                              </button>
                          </div>
                      ))}
                      {/* 이미지 업로드 버튼 */}
                      <div 
                          className="upload-button"
                          onClick={() => document.getElementById('fileInput')?.click()}
                      >
                          <img src="/camera.svg" alt="upload" className="w-6 h-6" />
                          <p className="text-sm text-[#6B7280] font-normal mt-2">사진 추가</p>
                          <input 
                              id="fileInput"
                              type="file"
                              accept="image/*"
                              multiple
                              className="text-sm hidden"
                              onChange={handleImageUpload}
                          />
                      </div>
                  </div>
              </div>
              {/* 상품 정보 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">상품명</p>
                  <p className="text-red-500 mx-2">*</p>
              </div>
              <div className="">
                  <input 
                      type="text" 
                      name="name"
                      className="add-input" 
                      placeholder="상품명을 입력해주세요." 
                      value={productData.name}
                      onChange={handleInputChange}
                  />
              </div>
              {/* 꿀벌 종류 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">벌 종류</p>
                  <p className="text-red-500 mx-2">*</p>
              </div>
              <div className="">
                  <select 
                      name="beeType" 
                      id="beeType" 
                      className="add-input"
                      value={productData.beeType}
                      onChange={handleInputChange}
                  >
                      <option value="">벌 종류를 선택하세요.</option>
                      <option value="HONEYBEE">꿀벌</option>
                      <option value="ASIAN_BUMBLEBEE">호박벌</option>
                      <option value="EUROPEAN_BUMBLEBEE">서양뒤영벌</option>
                      <option value="MASON_BEE">머리뿔가위벌</option>
                  </select>
              </div>
              {/* 가격 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">가격</p>
                  <p className="text-red-500 mx-2">*</p>
              </div>
              <div className="">
                  <input 
                      type="number" 
                      name="price"
                      className="add-input" 
                      placeholder="가격을 입력해주세요." 
                      value={productData.price === 0 ? "" : productData.price}
                      onChange={handleInputChange}
                  />
              </div>
              {/* 상품 설명 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">상세 정보</p>
              </div>
              <div className="">
                  <textarea 
                      name="content" 
                      id="content" 
                      className="w-full h-55 p-5 tracking-wide leading-relaxed
                      border border-[#E2E5EB] rounded-md resize-none" 
                      placeholder={`상품 소개 양식
관리 방법:
거래 형태: (임대 / 구매)
거래 방법: (온라인 / 오프라인)
원산지: 국내 / 해외
                      `}
                      value={productData.content} 
                      onChange={handleInputChange}
                  />
              </div>
              {/* 등록 버튼 */}
              <div className="w-full flex justify-end">
                  <button 
                      type="submit" 
                      className="submit-button"
                      disabled={isSubmitting || !authToken}
                  >
                      {isSubmitting ? '등록 중...' : '등록하기'}
                  </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
}