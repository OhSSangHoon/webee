import DaumPostcodeEmbed from "react-daum-postcode";
// Daum에서 제공하는 주소 찾기 api 사용
interface PostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
}

interface PostcodeModalProps {
  setIsOpen: (open: boolean) => void;
  onComplete: (address: string) => void; // onComplete: 성공 시 실행됨. api 자체 기능
}

export const PostcodeModal = ({
  setIsOpen,
  onComplete,
}: PostcodeModalProps) => {
  const completeHandler = (data: PostcodeData) => {
    onComplete(data.address);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded shadow-lg w-[500px] max-w-full">
        <div className="flex justify-between items-center text-black p-4 border-b">
          <div>업체 주소 찾기</div>
          <div
            className="cursor-pointer hover:text-red-500 transition-transform duration-150"
            onClick={() => setIsOpen(false)}
          >
            X
          </div>
        </div>
        <DaumPostcodeEmbed
          onComplete={completeHandler}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};
