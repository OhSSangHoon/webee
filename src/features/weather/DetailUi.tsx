"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  stn_Code: string;
  stn_Name: string;
  date: string;
  temp: string;
  max_Temp: string;
  min_Temp: string;
  hum: string;
  widdir: string;
  wind: string;
  max_Wind: string;
  rain: string;
  sun_Time: string;
  sun_Qy: string;
  condens_Time: string;
  gr_Temp: string;
  soil_Temp: string;
  soil_Wt: string;
};

type DetailUiProps = {
  KoreanAddress: string;
};

export default function DetailUi({ KoreanAddress }: DetailUiProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  const serviceKey =
    "ZVhi1EuW9EG9to4ZqjDmQmp7pOO1zpjryb3%2FTIx0HcYEzGfMifk2nF%2FIhWF04OlK0VbXWTZ2yg%2BiAU%2FbLPtprQ%3D%3D";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const url = `https://apis.data.go.kr/1390802/AgriWeather/WeatherObsrInfo/V2/GnrlWeather/getWeatherTenMinList?serviceKey=${serviceKey}&Page_No=1&Page_Size=100&date=${today}`;

        const res = await fetch(url);
        const xmlText = await res.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        let matchedItem: Element | null = null;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const name =
            item.getElementsByTagName("stn_Name")[0]?.textContent ?? "";
          if (name.includes(KoreanAddress)) {
            matchedItem = item;
            break;
          }
        }

        if (!matchedItem) {
          setError(`"${KoreanAddress}"에 해당하는 관측소를 찾을 수 없습니다.`);
          return;
        }

        const getVal = (tag: string) =>
          matchedItem!.getElementsByTagName(tag)?.[0]?.textContent ?? "-";

        setData({
          stn_Code: getVal("stn_Code"),
          stn_Name: getVal("stn_Name"),
          date: getVal("date"),
          temp: getVal("temp"),
          max_Temp: getVal("max_Temp"),
          min_Temp: getVal("min_Temp"),
          hum: getVal("hum"),
          widdir: getVal("widdir"),
          wind: getVal("wind"),
          max_Wind: getVal("max_Wind"),
          rain: getVal("rain"),
          sun_Time: getVal("sun_Time"),
          sun_Qy: getVal("sun_Qy"),
          condens_Time: getVal("condens_Time"),
          gr_Temp: getVal("gr_Temp"),
          soil_Temp: getVal("soil_Temp"),
          soil_Wt: getVal("soil_Wt"),
        });
      } catch (err) {
        console.error("API 호출 오류:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchWeather();
  }, [KoreanAddress]);

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white/20 border border-white/20 rounded-xl text-left h-80 shadow-xl text-white">
      <h1 className="text-2xl font-bold mb-6">
        🌾{KoreanAddress} 관측소 농업기상 정보
      </h1>
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {data ? (
        <div className="space-y-2 text-sm">
          <p>
            <strong>관측지점명:</strong> {data.stn_Name}
          </p>
          <p>
            <strong>관측일자:</strong> {data.date}
          </p>

          <p>
            <strong>습도:</strong> {data.hum} %
          </p>
          <p>
            <strong>지중온도:</strong> {data.soil_Temp} ℃
          </p>
          <p>
            <strong>토양수분보정값:</strong> {data.soil_Wt} %
          </p>
          <p className="text-xs">※ 국립농업과학원 제공</p>
        </div>
      ) : (
        !error && <p>불러오는 중...</p>
      )}
    </div>
  );
}
