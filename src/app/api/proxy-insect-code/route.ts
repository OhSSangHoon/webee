// 항목 리스트용 프록시 서버 
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`http://api.nongsaro.go.kr/service/insectAgchApplc/insectAgchApplcCode?apiKey=20250702MH7H2UTYMOAIILIEF5M7W`);
  const xml = await res.text();
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
