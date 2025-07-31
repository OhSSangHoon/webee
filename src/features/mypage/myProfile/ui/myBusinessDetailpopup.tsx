import { useEffect } from "react";
import { useBusinessStore } from "@/shared/business/model";

interface Props {
  businessId: number;
  x: number;
  y: number;
  onClose: () => void;
}

export function BusinessDetailPopup({ businessId, x, y, onClose }: Props) {
  const detail = useBusinessStore((state) => state.selectedDetail); // ✅ selectedDetail로 변경
  const fetchDetail = useBusinessStore((state) => state.fetchDetail);

  useEffect(() => {
    fetchDetail(businessId);
  }, [businessId, fetchDetail]);

  return (
    <div
      style={{ top: y + 10, left: x + 10 }}
      className="absolute z-50 bg-white border border-gray-300 shadow-md p-4 rounded text-sm"
      onMouseLeave={onClose}
    >
      {detail ? (
        <div className="flex flex-col gap-1">
          <div>
            <strong>대표자:</strong> {detail.representativeName}
          </div>
          <div>
            <strong>사업장:</strong> {detail.businessAddress}
          </div>
          <div>
            <strong>개업일자:</strong> {detail.commencementDate}
          </div>
          <div>
            <strong>주소:</strong> {detail.businessAddress}
          </div>
          <div>
            <strong>카카오 문의:</strong>{" "}
            {detail.kakaoChatUrl ? (
              <a
                href={detail.kakaoChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {detail.kakaoChatUrl}
              </a>
            ) : (
              "없음"
            )}
          </div>
          <div>
            <strong>사이트 주소:</strong>{" "}
            {detail.onlineStoreUrl ? (
              <a
                href={detail.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {detail.onlineStoreUrl}
              </a>
            ) : (
              "없음"
            )}
          </div>
        </div>
      ) : (
        <div>로딩 중...</div>
      )}
    </div>
  );
}
