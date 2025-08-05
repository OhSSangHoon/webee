"use client";

import { BusinessDetail } from "@/shared/business/api";
import { useEffect } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessInfo: BusinessDetail;
}

export default function ContactModal({ isOpen, onClose, businessInfo }: ContactModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getKakaoId = (kakaoChatUrl?: string) => {
    if (!kakaoChatUrl) return null;
    const match = kakaoChatUrl.match(/https:\/\/pf\.kakao\.com\/(.+)/);
    return match ? match[1] : null;
  };

  const kakaoId = getKakaoId(businessInfo.kakaoChatUrl);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600  cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-lg font-bold mb-4">판매자 문의</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">업체 정보</h4>
            <p className="text-sm text-gray-600">{businessInfo.companyName}</p>
            <p className="text-sm text-gray-600">{businessInfo.representativeName}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-700">전화번호</p>
                <p className="text-sm text-gray-600">{businessInfo.phoneNumber}</p>
              </div>
              <a 
                href={`tel:${businessInfo.phoneNumber}`}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                전화걸기
              </a>
            </div>
            
            {kakaoId && (
              <div className="flex items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-700">카카오톡</p>
                  <p className="text-sm text-gray-600">@{kakaoId}</p>
                </div>
                <a 
                  href={businessInfo.kakaoChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500"
                >
                  채팅하기
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300  cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}