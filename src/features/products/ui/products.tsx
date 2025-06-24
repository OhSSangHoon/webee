"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "@/shared/auth/useUserStore";
import { useRouter } from "next/navigation";
import { productData, BeeType } from "@/features/products/model/model";
import { useBusinessStore } from "@/shared/business/model";
import { createProduct } from "@/features/products/api/api";
import Image from "next/image";

export default function ProductsPage() {
  const router = useRouter();
  const { isLoggedIn, userName, realName } = useUserStore();
  const { list: businessList, fetchList: fetchBusinessList } = useBusinessStore();
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{url: string}[]>([]);
  
  const [productData, setProductData] = useState<productData>({
    name: "",
    price: 0,
    beeType: "" as BeeType,
    content: "",
    origin: "",
    transactionType: "",
    transactionMethod: "",
    businessId: 0,
  });

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 토큰 확인 및 업체 정보 로드
  useEffect(() => {
    if(!isClient) return;

    const token = localStorage.getItem("accessToken");
    setAuthToken(token);

    setIsLoading(false);

    if(isLoading === false && isLoggedIn === false) {
      alert("로그인이 필요한 서비스입니다.");
      router.replace("/signIn");
    }

    // 로그인된 상태라면 업체 정보 불러오기
    if (isLoggedIn && token) {
      fetchBusinessList();
    }
  }, [isClient, isLoading, isLoggedIn, router, fetchBusinessList, userName, realName]);

  // 업체 목록 로드 완료 후 로그 출력
  useEffect(() => {
    if (businessList.length > 0) {
      // 업체가 하나뿐이면 자동 선택
      if (businessList.length === 1) {
        setProductData(prev => ({
          ...prev,
          businessId: businessList[0].businessId
        }));
      }
    }
  }, [businessList]);

  // 입력값 변경 처리
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setProductData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 0,
      }));
    } else if (name === 'businessId') {
      const businessId = value ? parseInt(value, 10) : 0;
      setProductData((prev) => ({
        ...prev,
        [name]: businessId,
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  // 이미지 업로드 처리
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    setImageFiles((prev) => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages(prev => [...prev, { url: imageUrl }]);
    });
  }, []);

  // 이미지 삭제 처리
  const handleDeleteImage = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    
    if (uploadedImages[index]?.url) {
      URL.revokeObjectURL(uploadedImages[index].url);
    }
  }, [uploadedImages]);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 필수 입력값 확인
    if (!productData.name || !productData.beeType || productData.price <= 0 || 
        !productData.origin || !productData.transactionType || !productData.transactionMethod ||
        !productData.businessId) {
      alert("모든 필수 입력사항을 작성해주세요. (상품명, 벌 종류, 가격, 원산지, 거래 형태, 거래 방법, 판매 업체)");
      return;
    }

    // 선택된 업체가 사용자의 업체인지 확인
    const selectedBusiness = businessList.find(b => b.businessId === productData.businessId);
    if (!selectedBusiness) {
      alert("유효하지 않은 업체가 선택되었습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      // 147번째 줄: 사용되지 않는 'result' 변수 제거
      await createProduct(productData, imageFiles);
      alert("상품이 성공적으로 등록되었습니다.");

      router.push("/");
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
                  <Image src="/warning.svg" alt="warning" width={20} height={20} />
                  <div className="flex flex-col ml-3">
                      <p className="warning-title">
                          상품 등록 주의사항
                      </p>
                      <ul className="warning-list">
                          <li>
                            상품명, 벌 종류, 가격, 원산지, 거래 형태, 거래 방법, 판매 업체는 필수 입력 항목입니다.
                          </li>
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
              <div>
                  <div className="flex flex-wrap gap-4">
                      {uploadedImages.map((image, index) => (
                          <div key={index} className="relative w-25 h-25 border border-gray-300 rounded-md overflow-hidden">
                              {/* 174번째 줄: img 태그를 Image 컴포넌트로 변경 */}
                              <Image 
                                  src={image.url} 
                                  alt={`상품 이미지 ${index + 1}`} 
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                  unoptimized // blob URL이므로 최적화 비활성화
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
                      <div 
                          className="upload-button"
                          onClick={() => document.getElementById('fileInput')?.click()}
                      >
                          <Image src="/photo.svg" alt="upload" width={24} height={24} />
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

              {/* 업체 선택 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">판매 업체</p>
                  <p className="text-red-500 mx-2">*</p>
                  <p className="text-[#6B7280] text-xs font-normal">
                    {businessList.length > 0 
                      ? `${businessList.length}개의 등록된 업체 중 선택하세요.`
                      : "등록된 업체가 없습니다."
                    }
                  </p>
              </div>
              <div className="">
                  {businessList.length > 0 ? (
                    <select 
                        name="businessId" 
                        id="businessId" 
                        className="add-input"
                        value={productData.businessId || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">업체를 선택하세요.</option>
                        {businessList.map((business) => (
                          <option key={business.businessId} value={business.businessId}>
                            {business.companyName} - {business.businessAddress}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="add-input bg-gray-100 text-gray-500 cursor-not-allowed">
                      등록된 업체 정보가 없습니다. 먼저 업체를 등록해주세요.
                      <button 
                        type="button"
                        className="ml-2 text-blue-500 underline"
                        onClick={() => router.push('/business/register')}
                      >
                        업체 등록하기
                      </button>
                    </div>
                  )}
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
                      required
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
                      required
                  >
                      <option value="">벌 종류를 선택하세요.</option>
                      <option value="HONEYBEE">꿀벌</option>
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
                      required
                  />
              </div>
              
              {/* 원산지 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">원산지</p>
                  <p className="text-red-500 mx-2">*</p>
              </div>
              <div className="">
                  <select 
                      name="origin" 
                      id="origin" 
                      className="add-input"
                      value={productData.origin}
                      onChange={handleInputChange}
                      required
                  >
                      <option value="">원산지를 선택하세요.</option>
                      <option value="국내산">국내산</option>
                      <option value="해외산">해외산</option>
                  </select>
              </div>
              
              {/* 거래 형태 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">거래 형태</p>
                  <p className="text-red-500 mx-2">*</p>
              </div>
              <div className="">
                  <select 
                      name="transactionType" 
                      id="transactionType" 
                      className="add-input"
                      value={productData.transactionType}
                      onChange={handleInputChange}
                      required
                  >
                      <option value="">거래 형태를 선택하세요.</option>
                      <option value="구매">구매</option>
                      <option value="임대">임대</option>
                  </select>
              </div>
              
              {/* 거래 방법 입력 영역 */}
              <div className="product-title">
                  <p className="font-medium text-[#333333]">거래 방법</p>
                  <p className="text-red-500 mx-2">*</p>
              </div>
              <div className="">
                  <select 
                      name="transactionMethod" 
                      id="transactionMethod" 
                      className="add-input"
                      value={productData.transactionMethod}
                      onChange={handleInputChange}
                      required
                  >
                      <option value="">거래 방법을 선택하세요.</option>
                      <option value="온라인">온라인</option>
                      <option value="오프라인">오프라인</option>
                  </select>
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
                      placeholder="상품에 대한 상세한 정보를 입력해주세요."
                      value={productData.content} 
                      onChange={handleInputChange}
                  />
              </div>

              {/* 등록 버튼 */}
              <div className="w-full flex justify-end">
                  <button 
                      type="submit" 
                      className="submit-button"
                      disabled={isSubmitting || !authToken || businessList.length === 0}
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