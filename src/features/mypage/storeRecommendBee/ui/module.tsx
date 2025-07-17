"use client";

import React, { useState, useEffect } from "react";

import { useBeeRecommendationStore } from "../model/store";
import { BeeRecommendationList } from "./List";
import { BeeRecommendationDetailModal } from "./DetailModel";

export default function BeeRecommendationPanel() {
  const { detailMap, loadDetail } = useBeeRecommendationStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (selectedId !== null) {
      loadDetail(selectedId);
    }
  }, [selectedId, loadDetail]);

  const selectedDetail = selectedId !== null ? detailMap[selectedId] : null;

  return (
    <div>
      <BeeRecommendationList
        onSelect={setSelectedId}
        setOpenModal={setOpenModal}
      />
      {selectedDetail && openModal && (
        <BeeRecommendationDetailModal
          detail={selectedDetail}
          onClose={() => setSelectedId(null)}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
