export default function BeehiveMap() {
  return (
    <div className=" relative custom-box max-w-[1047px]  flex flex-row justify-between items-center h-full ">
      <div className="absolute w-full h-full bg-black/20">개발 중입니다</div>
      <div className="">
        <div className="text-[18px] mb-5">경북 고령군</div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div>
            <div>재배작물</div>
            <div className="text-gray-custom">딸기</div>
          </div>
          <div>
            <div>품종</div>
            <div className="text-gray-custom">설향</div>
          </div>
          <div>
            <div>재배 방식</div>
            <div className="text-gray-custom">하우스 </div>
          </div>
          <div>
            <div>재배 면적</div>
            <div className="text-gray-custom">4,500m² (약 1,362평)</div>
          </div>
        </div>
      </div>
      <div className="w-[60%] h-[90%]  bg-[#D9D9D9] rounded-md">
        벌통 설치 위치 추천 지도
      </div>
    </div>
  );
}
