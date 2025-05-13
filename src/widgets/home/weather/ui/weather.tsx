export default function weather() {
  return (
    <div className=" bg-[#b8e6fe] w-full h-60 rounded-md text-xl text-black-custom flex flex-col justify-around items-start p-5">
      <div className="text-4xl">경북 예천군</div>
      <div className="text-8xl text-[#2B7FFF] font-bold flex flex-row ">
        25<div className="text-7xl">°C</div>
      </div>
      <div className="flex flex-col">
        <div className=" text-sm flex flex-row">
          일출 <div className="font-semibold text-[16px]">7</div>시
        </div>
        <div className=" text-sm flex flex-row">
          일몰 <div className="font-semibold text-[16px]">6</div>시{" "}
          <div className="font-semibold text-[16px]">30</div>분
        </div>
      </div>
      <div>벌들이 활동하기 좋은 날이에요. 벌통을 활짝 열어주세요!</div>
    </div>
  );
}

// 날씨에 따라 배경 바꾸기 예: 비오는 배경, 눈오는 배경, 맑은 하늘 등
