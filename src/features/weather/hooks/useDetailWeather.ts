import { useEffect, useState } from "react";

type DetailWeatherData = {
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

export function useDetailWeather(koreanAddress: string) {
  const [data, setData] = useState<DetailWeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const serviceKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    if (!koreanAddress) return;

    const fetchWeather = async () => {
      setLoading(true);
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
          if (name.includes(koreanAddress)) {
            matchedItem = item;
            break;
          }
        }

        if (!matchedItem) {
          setError(`"${koreanAddress}"에 해당하는 관측소를 찾을 수 없습니다.`);
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
        setError("");
      } catch (err) {
        console.error("API 호출 오류:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [koreanAddress, serviceKey]);

  return { data, error, loading };
}