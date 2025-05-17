export default function MySaleList() {
  return (
    <div className="custom-box2 w-full min-h-fit h-[280px]  flex flex-col justify-center items-center pb-10">
      <div className="custom-box2-title mb-4">내가 등록한 상품 목록</div>
      <div className="flex flex-row justify-between items-center w-full h-full px-10 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="w-1/4 max-w-[320px] h-[280px] rounded-md border border-gray-300 flex flex-col"
          >
            {/* 위쪽 회색 박스 */}
            <div className="bg-[#E5E7EB] h-1/2 w-full rounded-t-md" />

            {/* 아래쪽 흰 배경 박스 */}
            <div className="h-1/2 w-full bg-white p-4 rounded-b-md flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-1">상품 제목</div>
                <div className="text-[#615FFF] text-sm">150,000원</div>
              </div>
              <button className="mt-4 text-[#2B7FFF] border border-[#2B7FFF] px-3 py-1 rounded-md hover:bg-[#2B7FFF] hover:text-white transition self-start mb-10">
                수정
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
