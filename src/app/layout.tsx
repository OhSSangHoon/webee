import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/widgets";
import Providers from "./providers";
import HydrationProvider from "@/app/HydrationProvider";
import ChatBot from "@/features/chatBot/ChatBotModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  alternates: {
    canonical: '/',
  },
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HydrationProvider>
          <Header />
          <Providers>
            {children}
          </Providers>
        </HydrationProvider>
        <ChatBot />
      </body>
    </html>
  );
}