"use client";

import { useEffect } from "react";
import { useBusinessStore } from "@/shared/business/model";
import { BusinessDetailPopup } from "./myBusinessDetailpopup";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export function BusinessList() {
  const businessList = useBusinessStore((state) => state.list);
  const fetchList = useBusinessStore((state) => state.fetchList);
  const fetchDetail = useBusinessStore((state) => state.fetchDetail);
  const detailsById = useBusinessStore((state) => state.detailsById);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 각 업체의 detail 정보를 미리 로드
  useEffect(() => {
    businessList.forEach((business) => {
      fetchDetail(business.businessId);
    });
  }, [businessList, fetchDetail]);

  const handleClick = (e: React.MouseEvent, id: number) => {
    setSelectedId(id);
    setPopupPos({ x: e.clientX, y: e.clientY });
  };

  if (businessList.length === 0) {
    return <div className="text-gray-500">등록된 업체가 없습니다.</div>;
  }

  return (
    <div className="relative pb-3">
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        className="w-full business-swiper border-b border-gray-400"
      >
        {businessList.map((b) => {
          const detail = detailsById[b.businessId];
          return (
            <SwiperSlide key={b.businessId}>
              <div
                className="custom-button cursor-pointer py-2"
                onClick={(e) => handleClick(e, b.businessId)}
              >
                <div className="flex flex-col gap-1 mb-5">
                  <div className="text-base font-regular text-gray-700">
                    업체명{" "}
                    <span className="text-gray-900 pl-4">{b.companyName}</span>
                  </div>
                  {detail && (
                    <>
                      <div className="text-base font-regular text-gray-700">
                        대표자{" "}
                        <span className="text-gray-900 pl-4">
                          {detail.representativeName}
                        </span>
                      </div>
                      <div className="text-base font-regular text-gray-700">
                        개업일{" "}
                        <span className="text-gray-900 pl-4">
                          {detail.commencementDate}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {selectedId !== null && popupPos && (
        <BusinessDetailPopup
          businessId={selectedId}
          x={popupPos.x}
          y={popupPos.y}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
