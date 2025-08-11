'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideSkeleton = () => {
      setIsVisible(false);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(hideSkeleton);
    } else {
      // fallback: 1초 후 숨김
      setTimeout(hideSkeleton, 1000);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2] z-50 flex items-center justify-center">
      <div className="text-center">
        {/* 로딩 애니메이션 벌 */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 animate-bounce">
              <Image 
                src="/bee.webp" 
                alt="로딩 중..." 
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
            {/* 날개 플래핑 효과 */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-1 bg-white/60 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* webee 로고 텍스트 */}
        <div className="mb-4">
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-yellow-300">webee</span>
          </h1>
          <p className="text-white/80 text-lg">농업인의 든든한 파트너</p>
        </div>

        {/* 로딩 인디케이터 */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        
        <p className="text-white/60 text-sm mt-4">로딩 중...</p>
      </div>
    </div>
  );
}