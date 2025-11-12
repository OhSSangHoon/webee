import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/widgets";
import Providers from "./providers";
import HydrationProvider from "@/app/HydrationProvider";
import Chatbot from "@/features/chatBot/ui/ChatBotModal";
import { Footer } from "@/widgets";

export const metadata: Metadata = {
  title: {
    default: "webee - 수정벌 전문 플랫폼",
    template: "%s | webee"
  },
  description: "수정벌과 관련된 모든 정보! AI 질병진단, 맞춤 수정벌 추천, 거래 연결, 농약 정보까지 농업인의 든든한 파트너 webee와 함께하세요.",
  keywords: ["수정벌", "webee", "위비", "농업", "질병진단", "AI진단", "수정벌추천", "농약", "양봉", "농업기술"],
  authors: [{ name: "webee" }],
  creator: "webee",
  publisher: "webee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://webee-ten.vercel.app/'),
  openGraph: {
    title: "webee - 수정벌 전문 플랫폼",
    description: "수정벌과 관련된 모든 정보! AI 질병진단, 맞춤 수정벌 추천, 거래 연결까지",
    url: 'https://webee-ten.vercel.app',
    siteName: 'webee',
    locale: 'ko_KR',
    type: 'website',
    images: ['/LOGO.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "webee - 수정벌 전문 플랫폼",
    description: "수정벌과 관련된 모든 정보! AI 질병진단, 맞춤 수정벌 추천, 거래 연결까지",
    images: ['/LOGO.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="dns-prefetch" href="https://api.webee.sbs" />
        <link rel="dns-prefetch" href="https://dapi.kakao.com" />
        <link rel="dns-prefetch" href="https://mts.daumcdn.net" />
        <link rel="preload" href="/font/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/webee.svg" as="image" type="image/svg+xml" crossOrigin="anonymous" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col container border-x border-gray-500" // 폰트 로딩 완료 후 제거
      >
        <HydrationProvider>
          <Header />
          <Providers>
            <main className="flex-1">
              {children}
            </main>
          </Providers>
          <Footer />
        </HydrationProvider>
        <Chatbot />
      </body>
    </html>
  );
}