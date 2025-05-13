import Image from "next/image";
export default function DiagnosisBanner() {
  const banerText = "text-sm mb-1 text-left ";
  return (
    <div className="w-[24rem] h-[30%] rounded-xl overflow-hidden shadow-lg">
      <div className="h-[30%] bg-[#f5c45e] text-[#592b2b] flex items-center justify-start  text-3xl font-extrabold  px-4 py-3">
        꿀벌 질병 진단↗
      </div>

      <div className="h-[70%] bg-[#102E50] text-white  flex flex-col justify-center px-4 pt-2">
        <p className={banerText}>AI와 빅데이터로 꿀벌 건강, 쉽게 체크해요!</p>
        <p className={banerText}>응애, 부저병, 날개불구바이러스감염증,</p>
        <p className={banerText}>
          석고병까지 빠르고 간편하게 확인할 수 있어요.
        </p>
        <Image
          src="/diagnosis.svg"
          alt="bee"
          width={100}
          height={100}
          className="my-5"
        />
      </div>
    </div>
  );
}
