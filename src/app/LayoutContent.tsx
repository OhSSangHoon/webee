"use client";

import { usePathname } from "next/navigation";
import { Header, WebHeader, Footer } from "@/widgets";
import Chatbot from "@/features/chatBot/ui/ChatBotModal";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWebLanding = pathname === "/";

  if (isWebLanding) {
    // Web Landing Page
    return (
      <>
        <WebHeader />
        {children}
      </>
    );
  }

  // Mobile App Pages
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
