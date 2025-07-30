// feature/businessProfile/model/useBusinessProfileForm.ts
import { useState } from "react";

export function useBusinessProfileForm() {
  const [form, setForm] = useState({
    businessNumber: "",
    ceoName: "",
    startDate: "",
    businessCert: null as File | null,
    farmName: "",
    farmCeo: "",
    farmAddress: "",
    contact: "",
    onlineStore: "",
    inquiryMethod: "",
    kakaoId: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxSizeInMB = 5; // 5MB 제한
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      if (selectedFile.size > maxSizeInBytes) {
        alert(`파일 크기가 ${maxSizeInMB}MB를 초과합니다. 더 작은 이미지를 선택해주세요.`);
        e.target.value = ''; // 파일 선택 초기화
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleInquirySelect = (method: "phone" | "kakao") => {
    setForm((prev) => ({ ...prev, inquiryMethod: method }));
  };

  return {
    form,
    file,
    handleChange,
    handleFileChange,
    removeFile,
    handleInquirySelect,
  };
}
