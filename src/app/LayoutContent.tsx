"use client";

import { usePathname } from "next/navigation";
import { Header, WebHeader, Footer } from "@/widgets";
import Chatbot from "@/features/chatBot/ui/ChatBotModal";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWebPage = pathname === "/" || pathname === "/report";

  if (isWebPage) {
    // 웹 페이지 (랜딩, 리포트)
    return (
      <>
        <WebHeader />
        {children}
      </>
    );
  }

  // 모바일 앱 페이지
  return (
    <div className="min-h-screen bg-white">
      <div className="w-[375px] mx-auto border-x border-gray-500 min-h-screen bg-white flex flex-col relative">
        <Header />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}
