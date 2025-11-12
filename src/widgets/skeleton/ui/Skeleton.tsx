import Image from "next/image";

export default function Skeleton() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-lg font-medium text-gray-700">벌들이 정보를 열심히 나르고 있어요!</span>
        <div className="relative w-6 h-6 animate-bounce">
          <Image
            src="/bee.svg"
            alt="webee"
            width={24}
            height={24}
            className="animate-pulse"
          />
        </div>
      </div>
      <div className="text-sm text-gray-500">
        잠시만 기다려주세요...
      </div>

      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 bg-main-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-2 h-2 bg-main-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-2 h-2 bg-main-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
    </div>
  );
}