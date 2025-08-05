"use client";

import { useWeatherData, useDetailWeather } from "../model/hooks";
import { beeTemperatureData, getBeeBehaviorMessage } from "../model/temp";

import {
  getWeatherIcon,
  getWeatherKorean,
  formatDateShort,
  formatDayShort,
  formatTime,
  getDailyForecast,
  getBeeMessage,
} from "../model/utils";

/**
 * 날씨 정보를 표시하는 메인 UI 컴포넌트
 * 현재 날씨, 7일 예보, 농업기상 정보를 포함합니다.
 */
export default function WeatherUI() {
  const { weatherData, forecastData, koreanAddress, loading, error } =
    useWeatherData();
  const {
    data: detailData,
    error: detailError,
    loading: detailLoading,
  } = useDetailWeather(koreanAddress);

  // 로딩 상태 UI
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-6xl p-8 shadow-xl rounded-2xl bg-white/10 min-h-[24rem]">
          <div className="text-center text-gray-600 text-lg flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 UI
  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-6xl p-8 shadow-xl rounded-2xl bg-white/10 min-h-[24rem]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center flex items-center justify-center h-full">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // 날씨 데이터가 없는 경우
  if (!weatherData) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-6xl p-8 shadow-xl rounded-2xl bg-white/10 min-h-[24rem]">
          <div className="text-center text-gray-600 text-lg flex items-center justify-center h-full">
            날씨 데이터를 불러올 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  //날씨 기반 꿀벌 행동 상태메세지
  const currentBeeMessage = getBeeBehaviorMessage(
    Math.round(weatherData.main.temp),
    beeTemperatureData
  );

  const dailyForecast = getDailyForecast(forecastData);

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-6xl p-8 shadow-xl rounded-2xl bg-white/10 min-h-[24rem]">
        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col justify-between min-h-96">
            <div>
              <div className="flex flex-row items-center justify-between mb-6">
                {/* 메인 날씨 정보 */}
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
                    일출 {formatTime(weatherData.sys.sunrise)} • 일몰{" "}
                    {formatTime(weatherData.sys.sunset)}
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

              {/* 6일 예보 */}
              {forecastData && (
                <div className="mb-6">
                  <div className="grid grid-cols-5 gap-3">
                    {dailyForecast.map((day, index) => {
                      const temp = Math.round(
                        (day.temp_max + day.temp_min) / 2
                      );
                      return (
                        <div
                          key={index}
                          className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
                        >
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

            {/* 벌 관련 메시지 */}
            <div className="bg-white/15 rounded-xl p-2 text-center">
              <div className="text-white text-lg font-semibold">
                {getBeeMessage(weatherData)}
              </div>
            </div>

            {/*온도별 꿀벌 행동 */}
            <div className="relative group">
              <div className="bg-white/15 rounded-xl p-2 mt-2 text-center  text-white  text-sm font-base cursor-help">
                {currentBeeMessage}(❓자세히보기)
              </div>

              {/* 툴팁: 마우스 호버 시 전체 리스트 표시 */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white/90 text-black p-4 rounded-lg shadow-xl w-full max-w-2xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none group-hover:pointer-events-auto">
                <ul className="h-full overflow-y-auto space-y-2 text-sm">
                  {beeTemperatureData.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between border-b pb-1"
                    >
                      <span className="font-medium">{item.range}</span>
                      <span className="text-right">{item.behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 농업기상 정보 사이드바 */}
          <div className="w-full lg:w-80 bg-white/20 border border-white/10 rounded-xl p-4 flex flex-col">
            <div className="flex-1">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                🌾 농업기상 정보
              </h3>

              {detailError && (
                <p className="text-red-300 text-xs mb-2">{detailError}</p>
              )}

              {detailData ? (
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-white/70 text-xs mb-1">관측소</div>
                    <div className="text-white text-sm font-semibold">
                      {detailData.stn_Name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-white/70 text-xs mb-1">습도</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.hum}%
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-white/70 text-xs mb-1">지중온도</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.soil_Temp}℃
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-white/70 text-xs mb-1">토양수분</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.soil_Wt}%
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-white/70 text-xs mb-1">강수량</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.rain}mm
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 ">
                    <div className="bg-white/10 rounded-l-lg p-3">
                      <div className="text-white/70 text-xs mb-1">풍향</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.widdir}
                      </div>
                    </div>
                    <div className="bg-white/10 p-3">
                      <div className="text-white/70 text-xs mb-1">풍속</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.wind}m/s
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-r-lg p-3">
                      <div className="text-white/70 text-xs mb-1">최대풍속</div>
                      <div className="text-white text-sm font-semibold">
                        {detailData.max_Wind}m/s{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                detailLoading && (
                  <p className="text-white/70 text-sm text-center py-4">
                    불러오는 중...
                  </p>
                )
              )}
            </div>

            {/* 데이터 출처 정보 */}
            <div className="text-center pt-4 border-t border-white/10 mt-auto">
              <div className="text-white/50 text-xs">{detailData?.date}</div>
              <div className="text-white/40 text-xs">※ 국립농업과학원</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
