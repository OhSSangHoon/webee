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
