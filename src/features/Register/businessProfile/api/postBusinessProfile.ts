import api from "@/shared/auth/lib";

interface BusinessProfilePayload {
  companyName: string;
  businessAddress: string;
  registrationNumber: string;
  representativeName: string;
  commencementDate: string;
  phoneNumber: string;
  onlineStoreUrl?: string;
  kakaoChatUrl?: string;
  businessCertificateImage?: File;
}

export async function postBusinessProfile(data: BusinessProfilePayload) {
  const formData = new FormData();

  const requestPayload = {
    companyName: data.companyName,
    businessAddress: data.businessAddress,
    registrationNumber: data.registrationNumber,
    representativeName: data.representativeName,
    commencementDate: data.commencementDate,
    phoneNumber: data.phoneNumber,
    onlineStoreUrl: data.onlineStoreUrl,
    kakaoChatUrl: data.kakaoChatUrl,
  };

  formData.append(
    "request",
    new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
  );

  // 파일은 선택
  if (data.businessCertificateImage) {
    formData.append("businessCertificateImage", data.businessCertificateImage);
  }

  const response = await api.post("profile/business", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return response.data;
}
