// 검색 결과 리스트용
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = new URLSearchParams({
    apiKey: "20250702MH7H2UTYMOAIILIEF5M7W",
    pageNo: searchParams.get("pageNo") || "1",
    numOfRows: searchParams.get("numOfRows") || "10",
  });

  if (searchParams.get("sCropsNm"))
    query.set("sCropsNm", searchParams.get("sCropsNm")!);
  if (searchParams.get("sPrpos"))
    query.set("sPrpos", searchParams.get("sPrpos")!);
  if (searchParams.get("sSprngspcsNm"))
    query.set("sSprngspcsNm", searchParams.get("sSprngspcsNm")!);

  const res = await fetch(
    `http://api.nongsaro.go.kr/service/insectAgchApplc/insectAgchApplcLst?${query.toString()}`
  );
  const xml = await res.text();
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
