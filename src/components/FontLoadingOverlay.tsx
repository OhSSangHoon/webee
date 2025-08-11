'use client';

import { useEffect, useState } from 'react';

export default function FontLoadingOverlay() {
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
        <div className="animate-pulse">
          <div className="bg-white/20 rounded-lg h-16 w-80 mx-auto mb-4"></div>
          <div className="bg-white/10 rounded-lg h-8 w-60 mx-auto mb-6"></div>
          <div className="bg-yellow-400/30 rounded-full h-12 w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}