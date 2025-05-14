export default function BeeWrapper() {
  return (
    <div className="flex flex-row justify-around items-center gap-5 w-100 mt-3 relative">
      <div className=" custom-box2 max-w-[400px] h-58  flex flex-col justify-start items-start">
        <div className="custom-box2-title2 flex flex-row justify-between ">
          <div>서양 뒤영벌</div>
          <div className="absolute top-0 right-0 mt-2 mr-2 rounded-2xl bg-pink-400 text-white  text-[10px] px-2 py-0 ">
            추천
          </div>
        </div>

        <div className=" flex flex-col w-full justify-between p-5">
          <div className="flex flex-row justify-between">
            <div className="text-gray-custom">작물</div>
            <div className="font-semibold">블루베리</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="text-gray-custom">추천일</div>
            <div className="font-semibold">2025.04.20</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="text-gray-custom">투입 적정 시기</div>
            <div className="font-semibold">2025.05.10 ~ 2025.05.15</div>
          </div>
          <div className="flex flex-row gap-2 ">
            <div className="text-grey-tag ">하우스</div>
            <div className="text-grey-tag "> 경북</div>
          </div>
          <div className="w-100% border-b border-gray-200 my-2" />

          <button className="custom-outline-button ">상세</button>
        </div>
      </div>
    </div>
  );
}
