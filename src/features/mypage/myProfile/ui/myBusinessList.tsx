"use client";

import { useEffect } from "react";
import { useBusinessStore } from "@/shared/business/model";
import { BusinessDetailPopup } from "./MyBusinessDetailpopup"
import { useState } from "react";

export function BusinessList() {
  const businessList = useBusinessStore((state) => state.list);
  const fetchList = useBusinessStore((state) => state.fetchList);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleClick = (e: React.MouseEvent, id: number) => {
    setSelectedId(id);
    setPopupPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex gap-2 mb-2">
      {businessList.map((b) => (
        <div
          key={b.businessId}
          className="custom-button cursor-pointer"
          onClick={(e) => handleClick(e, b.businessId)}
        >
          {b.companyName}
        </div>
      ))}
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
