import { Search } from "@/features";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수정벌 상품 검색 | webee",
  description: "전국의 수정벌 상품을 지도에서 검색하고 비교해보세요. 위치별, 벌 종류별로 필터링하여 최적의 수정벌을 찾아보세요.",
  keywords: ["수정벌 검색", "수정벌 상품", "벌 종류", "위치별 검색", "수정벌 업체", "양봉", "농업"],
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: "수정벌 상품 검색 | webee",
    description: "전국의 수정벌 상품을 지도에서 검색하고 비교해보세요.",
    url: '/search',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchPage() {
    return (
        <Search />
    )
}