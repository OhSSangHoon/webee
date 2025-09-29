// feature/businessProfile/model/useBusinessProfileForm.ts
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

export type BusinessProfileFormValues = {
  businessNumber: string;
  ceoName: string;
  startDate: string;
  farmName: string;
  contact: string;
  onlineStore: string;
  inquiryMethod: string;
  kakaoId: string;
};

const schema = yup.object({
  businessNumber: yup
    .string()
    .required("사업자등록번호를 입력해주세요.")
    .matches(/^\d{3}-\d{2}-\d{5}$|^\d{10}$/, "올바른 사업자등록번호 형식이 아닙니다."),
  ceoName: yup.string().required("대표자명을 입력해주세요."),
  startDate: yup.string().required("개업일자를 입력해주세요."),
  farmName: yup.string().required("업체명을 입력해주세요."),
  contact: yup
    .string()
    .required("연락처를 입력해주세요.")
    .matches(/^\d{3}-\d{4}-\d{4}$|^\d{11}$/, "올바른 연락처 형식이 아닙니다."),
  onlineStore: yup.string().default("").url("올바른 URL 형식이 아닙니다."),
  inquiryMethod: yup.string().required("문의 방법을 선택해주세요."),
  kakaoId: yup.string().default("").when('inquiryMethod', {
    is: 'kakao',
    then: (schema) => schema.required('카카오톡 ID를 입력해주세요.'),
    otherwise: (schema) => schema
  }),
});

export function useBusinessProfileForm() {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<BusinessProfileFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      businessNumber: "",
      ceoName: "",
      startDate: "",
      farmName: "",
      contact: "",
      onlineStore: "",
      inquiryMethod: "",
      kakaoId: "",
    },
    mode: "onBlur",
  });

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
    form.setValue("inquiryMethod", method);
  };

  return {
    form,
    file,
    handleFileChange,
    removeFile,
    handleInquirySelect,
  };
}
