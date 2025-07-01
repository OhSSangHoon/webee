"use client";

import { useEffect, useState } from "react";
import DetailUi from "./DetailUi";

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
            const koreanAddr =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              addr.state ||
              "알 수 없는 위치";
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

    return "⛈️날씨가 나빠요! 벌통을 닫아주세요 >-<";
  };

  return (
    <div className=" flex flex-col lg:flex-row justify-center items-center ">
      <div
        className="w-full h-80 shadow-xl rounded-2xl flex flex-col items-center justify-center "
        style={{
          background:
            "linear-gradient(to bottom, #78d0ff90 70%, #f6f6f661 100%)",
        }}
      >
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
          /* 메인 날씨 */
          <div className="w-full flex flex-row items-center justify-center ">
            <div className="relative mt-10">
              <div className="absolute bg-[#FFFCF8] w-50 h-50 rounded-full blur-[3px]"></div>
              <div className="bg-[#FFD8A5] rounded-full w-50 h-50 translate-y-[-15px]">
                <div className="bg-[#FFC477] rounded-full w-50 h-48 translate-y-[-17px]">
                  {/*현재 위치,온도*/}
                  <div className="flex flex-col justify-center items-center absolute inset-0">
                    <div className="text-white font-bold text-4xl translate-x-[-8px] translate-y-2 ">
                      <span className="text-xl text-shadow-md">📍</span>
                      {koreanAddress || weatherData.name}
                    </div>
                    <div className="text-blue-500 font-extrabold text-9xl text-shadow-2xs">
                      {Math.round(weatherData.main.temp)}
                      <span className="text-8xl">°C</span>
                    </div>
                    {/* 일출 일몰 */}
                    <div className=" text-center text-white text-shadow-md text-[12px] translate-y-[-8px] font-semibold">
                      일출:
                      {formatTime(weatherData.sys.sunrise)}
                      &nbsp;|&nbsp; 일몰:
                      {formatTime(weatherData.sys.sunset)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {forecastData && (
              /* 7일 예보 */
              <div className=" flex flex-col items-center justify-around w-[70%] ">
                <div className="flex flex-row items-center justify-around w-[90%]">
                  {getDailyForecast().map((day, index) => {
                    const temp = Math.round((day.temp_max + day.temp_min) / 2);

                    return (
                      <div key={index} className="text-center text-white ">
                        {/* 온도 표시 */}
                        <div className="text-lg font-bold mb-2 text-blue-500">
                          {temp}
                        </div>

                        {/* 날짜 표시 */}
                        <div className="text-sm opacity-90 mb-2">
                          {formatDateShort(day.dt)}
                        </div>

                        {/* 시간 표시*/}
                        <div className="text-xs opacity-75 mb-3">
                          {index === 0
                            ? "오전 2시"
                            : index === 1
                            ? "오전 5시"
                            : index === 2
                            ? "오전 8시"
                            : index === 3
                            ? "오전 11시"
                            : index === 4
                            ? "오후 2시"
                            : index === 5
                            ? "오후 5시"
                            : "오후 8시"}
                        </div>

                        {/* 요일 */}
                        <div className="text-sm font-semibold mb-3 ">
                          {formatDayShort(day.dt)}
                        </div>

                        {/* 날씨 아이콘 */}
                        <div className="text-3xl mb-2">
                          {getWeatherIcon(day.weather.main)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* 하단 메시지 */}
                <div className=" flex flex-row items-center justify-around w-full translate-y-4">
                  <div className="text-lg font-bold text-blue-700/50">
                    {getWeatherKorean(weatherData.weather[0].main)}
                  </div>
                  <div className="text-blue-500 text-2xl font-extrabold  bg-white/30 rounded-2xl p-2 px-5">
                    {getBeeMessage()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>{" "}
      <DetailUi KoreanAddress={koreanAddress} />
    </div>
  );
}
