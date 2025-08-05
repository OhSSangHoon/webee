import { ForecastData, DailyForecast, WeatherData } from './types';

/**
 * 날씨 상태에 따른 이모지 아이콘 반환
 */
export const getWeatherIcon = (weatherMain: string): string => {
  switch (weatherMain.toLowerCase()) {
    case "clear": return "☀️";
    case "clouds": return "☁️";
    case "rain": return "🌧️";
    case "drizzle": return "🌦️";
    case "thunderstorm": return "⛈️";
    case "snow": return "❄️";
    case "mist":
    case "fog":
    case "haze": return "🌫️";
    default: return "🌤️";
  }
};

/**
 * 날씨 상태를 한글로 번역
 */
export const getWeatherKorean = (weatherMain: string): string => {
  switch (weatherMain.toLowerCase()) {
    case "clear": return "맑음";
    case "clouds": return "구름 많음";
    case "rain": return "비";
    case "drizzle": return "이슬비";
    case "thunderstorm": return "뇌우";
    case "snow": return "눈";
    case "mist":
    case "fog":
    case "haze": return "안개";
    default: return "흐림";
  }
};

/**
 * Unix 타임스탬프를 짧은 날짜 형식으로 변환
 */
export const formatDateShort = (unix: number): string => {
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

/**
 * Unix 타임스탬프를 짧은 요일 형식으로 변환
 */
export const formatDayShort = (unix: number): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date(unix * 1000).getDay()];
};

/**
 * Unix 타임스탬프를 시간 형식으로 변환
 */
export const formatTime = (unix: number): string => {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 6일간의 일별 예보 데이터 처리
 */
export const getDailyForecast = (forecastData: ForecastData | null): DailyForecast[] => {
  if (!forecastData) return [];

  const dailyData: { [key: string]: DailyForecast } = {};
  const now = new Date();
  
  // 현재 시간이 21시 이후라면 다음날부터 시작
  const startDate = new Date(now);
  if (now.getHours() >= 21) {
    startDate.setDate(startDate.getDate() + 1);
  } else {
    // 21시 이전이라면 오늘은 제외하고 내일부터 시작
    startDate.setDate(startDate.getDate() + 1);
  }
  startDate.setHours(0, 0, 0, 0); // 시작일의 자정으로 설정

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    
    // 시작일 이전의 데이터는 제외
    if (date < startDate) return;
    
    const dateKey = date.toDateString();

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        dt: item.dt,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
      };
    } else {
      dailyData[dateKey].temp_min = Math.min(dailyData[dateKey].temp_min, item.main.temp_min);
      dailyData[dateKey].temp_max = Math.max(dailyData[dateKey].temp_max, item.main.temp_max);
    }
  });

  return Object.values(dailyData)
    .sort((a, b) => a.dt - b.dt)
    .slice(0, 5); // 5일만 표시
};

/**
 * 현재 날씨 상태에 따른 벌 관련 메시지 생성
 */
export const getBeeMessage = (weatherData: WeatherData | null): string | null => {
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
    return "🐝벌들이 활동하기 좋은 기상이에요. 벌통을 활짝 열어주세요!";
  }

  return "⛈️날씨가 나빠요! 벌통을 닫아주세요!";
};