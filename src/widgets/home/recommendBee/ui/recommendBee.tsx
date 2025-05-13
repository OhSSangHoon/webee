export default function RecommendBee() {
  return (
    <div className="basis-[75%] h-60 bg-[#fff8e1] rounded-md text-black-custom flex flex-col justify-around items-start p-5 text-[18px]">
      <div className="text-[32px]">수정벌 추천</div>
      <div>
        공공데이터와 ai를 이용하여 사용자의 작물에적절한 수정벌과 관련 상품
        투입일 등을 계산해줍니다.
      </div>
      <div className=" w-full flex justify-between items-end">
        <div>사용자님의 환경에 맞는 수정벌을 알아보고 정보를 얻어가세요!</div>
        <div className="blue-button py-2 px-4">추천받기</div>
      </div>
    </div>
  );
}
