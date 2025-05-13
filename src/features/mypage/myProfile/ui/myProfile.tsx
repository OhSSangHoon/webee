export default function MyProfile() {
  return (
    <div className="custom-box w-[25%] max-w-[375px] h-[260px] text-xs flex flex-col justify-around items-start">
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <span className="font-bold text-xl">홍길동</span>님 반갑습니다
        </div>
        <div>
          <a href="/myprofile" className="underline hover:text-black">
            프로필 수정
          </a>
        </div>
      </div>
      <div className=" flex flex-col justify-around items-center gap-5">
        <div className="flex flex-col gap-2">
          <div>나의 업체 정보</div>
          <div className=" flex flex-row gap-1">
            <div className="custom-button">길동꿀벌</div>
            <div className="custom-button">사업장 소재지명</div>
            <div className="custom-button">2007.05.05</div>
          </div>
        </div>
        <div className=" flex flex-col gap-2">
          <div>나의 농지 정보</div>
          <div className=" flex flex-row gap-1">
            <div className="custom-button">경북 고령군</div>
            <div className="custom-button">경북 예천군</div>
            <div className="custom-button">제주시 애월읍</div>
          </div>
        </div>
      </div>
    </div>
  );
}
