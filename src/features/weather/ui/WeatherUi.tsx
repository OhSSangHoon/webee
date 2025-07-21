"use client";

import { useEffect, useState } from "react";
import { useDetailWeather } from "../hooks/useDetailWeather";

type WeatherData = {
  name: string;
  weather: { main: string; description: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  sys: { sunrise: number; sunset: number };
  wind: { speed: number };
};

type ForecastData = {
  list: {
    dt: number;
    main: { temp: number; temp_min: number; temp_max: number };
    weather: { main: string; description: string }[];
  }[];
};

type AddressData = {
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

export default function WeatherUI() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [koreanAddress, setKoreanAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { data: detailData, error: detailError, loading: detailLoading } = useDetailWeather(koreanAddress);

  const API_KEY = "af3abab5447ba09c9b99af1252e0808e";

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 현재 날씨 데이터 가져오기
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
          );

          if (!weatherRes.ok) throw new Error("현재 날씨 API 호출 실패");
          const currentWeather = await weatherRes.json();
          setWeatherData(currentWeather);

          // 7일 예보 데이터 가져오기
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
          );

          if (!forecastRes.ok) throw new Error("예보 API 호출 실패");
          const forecast = await forecastRes.json();
          setForecastData(forecast);

          // 한글 주소 가져오기 (Nominatim API 사용)
          const addressRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ko`
          );

          if (addressRes.ok) {
            const addressData: AddressData = await addressRes.json();
            const addr = addressData.address;
            const fullKoreanAddr =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              addr.state ||
              "알 수 없는 위치";

            const koreanAddr = fullKoreanAddr.substring(0, 2);

            //nominatim api의 한글주소와 농업기상관측소 주소 맞추기
            setKoreanAddress(koreanAddr);
          }
        } catch (error) {
          setError("데이터를 가져오는 데 실패했습니다.");
          console.error("데이터 오류:", error);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("위치 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
      }
    );
  }, []);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return "☀️";
      case "clouds":
        return "☁️";
      case "rain":
        return "🌧️";
      case "drizzle":
        return "🌦️";
      case "thunderstorm":
        return "⛈️";
      case "snow":
        return "❄️";
      case "mist":
      case "fog":
      case "haze":
        return "🌫️";
      default:
        return "🌤️";
    }
  };

  const getWeatherKorean = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return "맑음";
      case "clouds":
        return "구름 많음";
      case "rain":
        return "비";
      case "drizzle":
        return "이슬비";
      case "thunderstorm":
        return "뇌우";
      case "snow":
        return "눈";
      case "mist":
      case "fog":
      case "haze":
        return "안개";
      default:
        return "흐림";
    }
  };
  const formatDateShort = (unix: number) => {
    const date = new Date(unix * 1000);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "오늘";
    }

    return date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    });
  };

  const formatDayShort = (unix: number) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[new Date(unix * 1000).getDay()];
  };

  // 7일간의 일별 예보 데이터 처리
  type DailyForecast = {
    dt: number;
    temp_min: number;
    temp_max: number;
    weather: { main: string; description: string };
  };

  const getDailyForecast = () => {
    if (!forecastData) return [];

    const dailyData: { [key: string]: DailyForecast } = {};

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          dt: item.dt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0],
        };
      } else {
        dailyData[date].temp_min = Math.min(
          dailyData[date].temp_min,
          item.main.temp_min
        );
        dailyData[date].temp_max = Math.max(
          dailyData[date].temp_max,
          item.main.temp_max
        );
      }
    });

    return Object.values(dailyData).slice(0, 7);
  };

  //일출, 일몰 계산
  const formatTime = (unix: number) => {
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBeeMessage = () => {
    if (!weatherData) return null;

    const currentTime = Date.now() / 1000;
    const { sunrise, sunset } = weatherData.sys;
    const weatherMain = weatherData.weather[0].main.toLowerCase();

    const isDaytime = currentTime > sunrise && currentTime < sunset;
    const isClearWeather = ["clear", "clouds"].includes(weatherMain);

    if (!isDaytime) {
      return "🌝벌들이 자러 갈 시간이에요!";
    }

    if (isClearWeather) {
      return "🐝벌들이 활동하기 좋은 날이에요. 벌통을 활짝 열어주세요!";
    }

    return "⛈️날씨가 나빠요! 벌통을 닫아주세요!";
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-6xl p-8 shadow-xl rounded-2xl bg-white/10">
        {loading && (
          <div className="text-center text-gray-600 text-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            불러오는 중...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 flex flex-col justify-between min-h-96">
              <div>
                <div className="flex flex-row items-center justify-between mb-6">
                  {/* 메인 날씨 */}
                  <div className="flex flex-col justify-center items-start">
                    <div className="text-white font-bold text-2xl mb-2">
                      <span className="text-lg text-shadow-md">📍</span>
                      {koreanAddress || weatherData.name}
                    </div>
                    <div className="text-white font-extrabold text-8xl text-shadow-2xs">
                      {Math.round(weatherData.main.temp)}
                      <span className="text-7xl">°C</span>
                    </div>
                    <div className="text-center text-white text-shadow-md text-sm font-semibold mt-2">
                      일출 {formatTime(weatherData.sys.sunrise)} • 일몰 {formatTime(weatherData.sys.sunset)}
                    </div>
                  </div>
                  
                  {/* 현재 날씨 상태 */}
                  <div className="text-center">
                    <div className="text-6xl mb-2">
                      {getWeatherIcon(weatherData.weather[0].main)}
                    </div>
                    <div className="text-white text-lg font-semibold mb-1">
                      {getWeatherKorean(weatherData.weather[0].main)}
                    </div>
                    <div className="text-white/80 text-sm">
                      체감 {Math.round(weatherData.main.feels_like)}°C
                    </div>
                  </div>
                </div>

                {/* 7일 예보 */}
                {forecastData && (
                  <div className="mb-6">
                    <div className="grid grid-cols-6 gap-3">
                      {getDailyForecast().map((day, index) => {
                        const temp = Math.round((day.temp_max + day.temp_min) / 2);
                        return (
                          <div key={index} className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                            <div className="text-white/80 text-xs font-medium mb-2">
                              {formatDayShort(day.dt)}
                            </div>
                            <div className="text-2xl mb-2">
                              {getWeatherIcon(day.weather.main)}
                            </div>
                            <div className="text-white font-bold text-lg mb-1">
                              {temp}°
                            </div>
                            <div className="text-white/70 text-xs">
                              {formatDateShort(day.dt)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 벌 메시지 */}
              <div className="bg-white/15 rounded-xl p-4 text-center">
                <div className="text-white text-lg font-semibold">
                  {getBeeMessage()}
                </div>
              </div>
            </div>

            {/* 농업기상 정보 */}
            <div className="w-full lg:w-80 bg-white/20 border border-white/10 rounded-xl p-4 flex flex-col">
              <div className="flex-1">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                </h3>
                {detailError && <p className="text-red-300 text-xs mb-2">{detailError}</p>}
                {detailData ? (
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-white/70 text-xs mb-1">관측소</div>
                      <div className="text-white text-sm font-semibold">{detailData.stn_Name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-white/70 text-xs mb-1">습도</div>
                        <div className="text-white text-sm font-semibold">{detailData.hum}%</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-white/70 text-xs mb-1">지중온도</div>
                        <div className="text-white text-sm font-semibold">{detailData.soil_Temp}℃</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-white/70 text-xs mb-1">토양수분</div>
                      <div className="text-white text-sm font-semibold">{detailData.soil_Wt}%</div>
                    </div>
                  </div>
                ) : (
                  !detailError && <p className="text-white/70 text-sm text-center py-4">불러오는 중...</p>
                )}
              </div>
              <div className="text-center pt-4 border-t border-white/10 mt-auto">
                <div className="text-white/50 text-xs">{detailData?.date}</div>
                <div className="text-white/40 text-xs">※ 국립농업과학원</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
