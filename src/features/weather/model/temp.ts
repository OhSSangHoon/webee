import { TemperatureInfo } from "./types";

//기온별 꿀벌 행동 리스트
export const beeTemperatureData: TemperatureInfo[] = [
  {
    range: "38℃ 이상",
    behavior: "38℃ 이상에서 벌통 내부 온도 조절 필요",
  },
  {
    range: "37℃ 이상",
    behavior: "37℃ 이상에서 야외 활동 멈춤",
  },
  {
    range: "33~36℃",
    behavior: "33℃ 이상에서 물 운반 등 제한적 외부 활동만 진행,밀랍 생성",
  },
  {
    range: "34~35℃",
    behavior: "유충 사육 시 유지해야 하는 내부 온도",
  },
  {
    range: "33℃ 이상",
    behavior: "33℃ 이상에서 물 운반 등의 제한적인 외부 활동만 진행",
  },
  { range: "15~33℃", behavior: "알 부화 및 애벌레 사육에 적합" },
  { range: "16~32℃", behavior: "외부 활동 최적 온도" },
  { range: "20℃ 이상", behavior: "여왕벌 교미 비행 가능" },
  { range: "15~20℃", behavior: "겨울 봉구(뭉침 현상) 형성 시기" },
  {
    range: "13~8℃",
    behavior: "비행은 가능하나 적극적이지 않음, 부분 검사 가능",
  },
  { range: "6℃", behavior: "활동 거의 없음, 근육 활동 저하" },
  { range: "5℃ 이하", behavior: "외부 벌 피해 위험, 내검 중지" },
  { range: "4℃", behavior: "꿀벌집단에 속하지 못한 벌은 사망" },
];

// 현재 기온에 맞는 문구를 가져오는 함수
export function getBeeBehaviorMessage(
  temp: number,
  data: TemperatureInfo[]
): string {
  for (const item of data) {
    const range = item.range.replace(/℃/g, "").replace(/\s/g, "");
    if (range.includes("이상")) {
      const val = parseFloat(range);
      if (temp >= val) return item.behavior;
    } else if (range.includes("이하")) {
      const val = parseFloat(range);
      if (temp <= val) return item.behavior;
    } else if (range.includes("~")) {
      const [min, max] = range.split("~").map(parseFloat);
      if (temp >= min && temp <= max) return item.behavior;
    } else if (!isNaN(parseFloat(range))) {
      const val = parseFloat(range);
      if (temp === val) return item.behavior;
    }
  }
  return "해당 온도에 대한 정보가 없습니다.";
}
